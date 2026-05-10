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

const app: Express = express();

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
    const token = req.headers.authorization?.replace("Bearer ", "") ?? req.ip ?? "unknown";
    return token.slice(0, 32);
  },
  message: { error: "Daily AI request limit reached." },
});

app.use(sitemapRouter);
app.use(landingRouter);
app.use(prayerTimesRouter);
app.use(namesSeoRouter);
app.use(duasSeoRouter);
app.use(quranSeoRouter);
app.use(toolsSeoRouter);
app.use(blogRouter);
app.use(comparisonRouter);

app.use("/api/ai", aiLimiter);
app.use("/api", globalLimiter, router);

export default app;
