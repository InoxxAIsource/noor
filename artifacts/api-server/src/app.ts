import express, { type Express } from "express";
import cors from "cors";
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
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sitemapRouter);
app.use(landingRouter);
app.use(prayerTimesRouter);
app.use(namesSeoRouter);
app.use(duasSeoRouter);
app.use(quranSeoRouter);
app.use(toolsSeoRouter);
app.use(blogRouter);
app.use(comparisonRouter);

app.use("/api", router);

export default app;
