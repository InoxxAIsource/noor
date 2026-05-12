import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

import landingRouter from "./seo/landing.js";
import prayerTimesRouter from "./seo/prayer-times-seo.js";
import namesSeoRouter from "./seo/names-seo.js";
import duasSeoRouter from "./seo/duas-seo.js";
import quranSeoRouter from "./seo/quran-seo.js";
import toolsSeoRouter from "./seo/tools-seo.js";
import blogRouter from "./seo/blog-seo.js";
import comparisonRouter from "./seo/comparison.js";
import sitemapRouter from "./seo/sitemap.js";
import emotionalRouter from "./seo/emotional-seo.js";
import salahClusterRouter from "./seo/salah-seo.js";
import reflectionRouter from "./seo/reflection-seo.js";
import habitsRouter from "./seo/habits-seo.js";
import aiClusterRouter from "./seo/ai-seo.js";
import hubPagesRouter from "./seo/hub-pages.js";
import journeyPagesRouter from "./seo/journey-pages.js";
import wellnessExpansionRouter from "./seo/wellness-expansion.js";
import salahExpansionRouter from "./seo/salah-expansion.js";
import quranExpansionRouter from "./seo/quran-expansion.js";
import habitsExpansionRouter from "./seo/habits-expansion.js";
import aiExpansionRouter from "./seo/ai-expansion.js";
import entityPagesRouter from "./seo/entity-pages.js";
import geoLandingPagesRouter from "./seo/geo-landing-pages.js";
import funnelPagesRouter from "./seo/funnel-pages.js";
import { runNotificationScheduler } from "./routes/notifications.js";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const aiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const token = req.headers.authorization?.replace("Bearer ", "") ?? "anon";
    return token.slice(0, 32);
  },
  message: { error: "Daily AI request limit reached." },
});

// SEO routers — registered before API routes
app.use(sitemapRouter);
app.use(landingRouter);
app.use(prayerTimesRouter);
app.use(namesSeoRouter);
app.use(duasSeoRouter);
app.use(quranSeoRouter);
app.use(toolsSeoRouter);
app.use(blogRouter);
app.use(comparisonRouter);

// SEO content clusters — Phase 1
app.use(emotionalRouter);
app.use(salahClusterRouter);
app.use(reflectionRouter);
app.use(habitsRouter);
app.use(aiClusterRouter);

// SEO Phase 2 — Hub pages, journeys, cluster expansion
app.use(hubPagesRouter);
app.use(journeyPagesRouter);
app.use(wellnessExpansionRouter);
app.use(salahExpansionRouter);
app.use(quranExpansionRouter);
app.use(habitsExpansionRouter);
app.use(aiExpansionRouter);

// SEO Phase 3 — Entity authority, GEO landing pages, funnels
app.use(entityPagesRouter);
app.use(geoLandingPagesRouter);
app.use(funnelPagesRouter);

app.use("/api/ai", aiLimiter);
app.use("/api", globalLimiter, router);

// Start prayer-time + daily notification scheduler
runNotificationScheduler().catch(() => null);

export default app;
