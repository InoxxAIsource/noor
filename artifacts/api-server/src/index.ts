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
