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
} from "./lib/db.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
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

    logger.info("Seed check complete");
  } catch (err) {
    logger.error({ err }, "Seed error");
  }
}

app.listen(port, async () => {
  logger.info({ port }, "Server listening");
  await seed();
});
