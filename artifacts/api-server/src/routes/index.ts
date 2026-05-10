import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import prayerRouter from "./prayer.js";
import streakRouter from "./streak.js";
import progressRouter from "./progress.js";
import sessionsRouter from "./sessions.js";
import duasRouter from "./duas.js";
import namesRouter from "./names.js";
import dailyRouter from "./daily.js";
import aiRouter from "./ai.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(prayerRouter);
router.use(streakRouter);
router.use(progressRouter);
router.use(sessionsRouter);
router.use(duasRouter);
router.use(namesRouter);
router.use(dailyRouter);
router.use(aiRouter);

export default router;
