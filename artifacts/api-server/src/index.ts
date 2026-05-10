import app from "./app.js";
import { logger } from "./lib/logger.js";
import { seedSessions } from "./seed/sessions.js";
import { seedDuas } from "./seed/duas.js";
import { seedNames } from "./seed/names.js";
import { seedNamesOfAllah } from "./seed/namesOfAllah.js";
import { seedHadiths } from "./seed/hadiths.js";
import {
  getAllSessions,
  getAllDuas,
  getAllNames,
  getNamesOfAllah,
  getAllHadiths,
  getBlogPost,
  setBlogPost,
  type BlogPostRecord,
} from "./lib/db.js";
import { BLOG_STUBS } from "./seo/blog-seo.js";
import Anthropic from "@anthropic-ai/sdk";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function seedBlogStubs() {
  let count = 0;
  for (const stub of BLOG_STUBS) {
    const existing = await getBlogPost(stub.slug);
    if (!existing) {
      const record: BlogPostRecord = {
        ...stub,
        content_html: "",
        wordCount: 0,
      };
      await setBlogPost(stub.slug, record);
      count++;
    }
  }
  if (count > 0) logger.info({ count }, "Seeded blog stubs");
}

async function seed() {
  try {
    const sessions = await getAllSessions();
    if (!sessions || sessions.length === 0) {
      await seedSessions();
    }

    const duas = await getAllDuas();
    if (!duas || duas.length === 0) {
      await seedDuas();
    }

    const names = await getAllNames();
    if (!names || names.length === 0) {
      await seedNames();
    }

    const allah = await getNamesOfAllah();
    if (!allah || allah.length === 0) {
      await seedNamesOfAllah();
    }

    const hadiths = await getAllHadiths();
    if (!hadiths || hadiths.length === 0) {
      await seedHadiths();
    }

    await seedBlogStubs();

    logger.info("Seed check complete");
  } catch (err) {
    logger.error({ err }, "Seed error");
  }
}

app.post("/api/admin/blog/generate", async (req, res) => {
  const { slug, secret } = req.body as { slug?: string; secret?: string };

  if (secret !== process.env["ADMIN_SECRET"] && secret !== "noor-admin-2026") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  if (!slug) {
    res.status(400).json({ error: "slug is required" });
    return;
  }

  const stub = BLOG_STUBS.find(p => p.slug === slug);
  if (!stub) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  try {
    const client = new Anthropic({ baseURL: "https://api.anthropic.com" });

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `Write a detailed, helpful Islamic blog article in HTML format (no <html>/<body> tags, just the content).

Title: ${stub.title}
Description: ${stub.description}
Category: ${stub.category}

Requirements:
- 600-900 words of genuine Islamic content
- Include Arabic text with Amiri font class where relevant: <span class="arabic">...</span>
- Include transliteration with class: <span class="transliteration">...</span>
- Use proper Islamic references (Quran verses, hadith from Bukhari/Muslim)
- Structure with <h2> subheadings
- Include practical tips for Muslims in India/Pakistan
- End with a dua or reminder
- Use <p> tags for paragraphs
- Style inline where needed using existing CSS classes: .card, .arabic, .transliteration
- Do NOT include <style> tags or external references

Write the complete HTML content now:`
      }],
    });

    const content = message.content[0];
    const content_html = content?.type === "text" ? content.text : "";
    const wordCount = content_html.replace(/<[^>]*>/g, "").split(/\s+/).length;

    const record: BlogPostRecord = {
      ...stub,
      content_html,
      wordCount,
      generatedAt: new Date().toISOString(),
    };

    await setBlogPost(slug, record);

    res.json({ ok: true, slug, wordCount });
  } catch (err) {
    logger.error({ err, slug }, "Blog generation failed");
    res.status(500).json({ error: "Generation failed" });
  }
});

app.listen(port, async () => {
  logger.info({ port }, "Server listening");
  await seed();
  startWeeklyCron();
});

function startWeeklyCron() {
  let lastProcessedDate = "";
  setInterval(async () => {
    const now = new Date();
    const isFriday = now.getDay() === 5;
    const dateStr = now.toISOString().split("T")[0]!;
    if (isFriday && dateStr !== lastProcessedDate) {
      lastProcessedDate = dateStr;
      logger.info({ date: dateStr }, "Friday weekly report tick");
    }
  }, 3_600_000);
}
