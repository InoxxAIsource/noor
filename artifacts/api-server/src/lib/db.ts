import Database from "@replit/database";

const db = new Database();

// ─── Low-level helpers ────────────────────────────────────────────────────────

async function dbGet<T>(key: string): Promise<T | null> {
  const result = await db.get(key);
  if (!result.ok) return null;
  return result.value as T ?? null;
}

async function dbSet(key: string, value: unknown): Promise<void> {
  await db.set(key, value);
}

async function dbList(prefix: string): Promise<string[]> {
  const result = await db.list(prefix);
  if (!result.ok) return [];
  return result.value ?? [];
}

// ─── User helpers ─────────────────────────────────────────────────────────────

export async function getUser(userId: string): Promise<Record<string, unknown> | null> {
  return dbGet<Record<string, unknown>>(`users:${userId}`);
}

export async function setUser(userId: string, user: Record<string, unknown>): Promise<void> {
  await dbSet(`users:${userId}`, user);
}

export async function getUserIdByEmail(email: string): Promise<string | null> {
  return dbGet<string>(`email:${email}`);
}

export async function setEmailIndex(email: string, userId: string): Promise<void> {
  await dbSet(`email:${email}`, userId);
}

// ─── Streak helpers ───────────────────────────────────────────────────────────

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPrayerDate: string | null;
  weeklyGoal: number;
  weeklyCompleted: number;
  totalPrayers: number;
  totalMinutes: number;
}

export async function getStreak(userId: string): Promise<StreakData | null> {
  return dbGet<StreakData>(`streak:${userId}`);
}

export async function setStreak(userId: string, streak: StreakData): Promise<void> {
  await dbSet(`streak:${userId}`, streak);
}

// ─── Progress helpers ─────────────────────────────────────────────────────────

export interface ProgressEntry {
  sessionId: string;
  durationListened: number;
  moodBefore: number | null;
  moodAfter: number | null;
  category: string;
  userId: string;
  timestamp: number;
}

export async function logProgress(userId: string, entry: ProgressEntry): Promise<void> {
  await dbSet(`progress:${userId}:${entry.timestamp}`, entry);
}

export async function getProgress(userId: string): Promise<ProgressEntry[]> {
  const keys = await dbList(`progress:${userId}:`);
  if (keys.length === 0) return [];
  const entries = await Promise.all(keys.map((k) => dbGet<ProgressEntry>(k)));
  return entries
    .filter((e): e is ProgressEntry => e !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
}

// ─── Salah log helpers ────────────────────────────────────────────────────────

export interface SalahLogEntry {
  prayer: string;
  date: string;
  userId: string;
  khushooRating: number | null;
  note: string | null;
  loggedAt: number;
}

export async function logSalah(userId: string, date: string, entry: SalahLogEntry): Promise<void> {
  await dbSet(`salahLog:${userId}:${date}:${entry.prayer}`, entry);
}

export async function getSalahLog(userId: string, date: string): Promise<string[]> {
  const keys = await dbList(`salahLog:${userId}:${date}:`);
  return keys.map((k) => k.split(":").pop() ?? "").filter(Boolean);
}

export async function getSalahLogFull(userId: string, date: string): Promise<SalahLogEntry[]> {
  const keys = await dbList(`salahLog:${userId}:${date}:`);
  if (keys.length === 0) return [];
  const entries = await Promise.all(keys.map((k) => dbGet<SalahLogEntry>(k)));
  return entries.filter((e): e is SalahLogEntry => e !== null);
}

// ─── Journal helpers ──────────────────────────────────────────────────────────

export async function saveJournal(userId: string, entry: Record<string, unknown>): Promise<void> {
  const ts = Date.now();
  await dbSet(`journal:${userId}:${ts}`, entry);
}

export async function getJournals(userId: string): Promise<unknown[]> {
  const keys = await dbList(`journal:${userId}:`);
  if (keys.length === 0) return [];
  const entries = await Promise.all(keys.map((k) => dbGet(k)));
  return entries.filter((e) => e !== null);
}

// ─── Content helpers ──────────────────────────────────────────────────────────

export async function getAllSessions(): Promise<unknown[] | null> {
  return dbGet<unknown[]>("sessions:all");
}

export async function setAllSessions(sessions: unknown[]): Promise<void> {
  await dbSet("sessions:all", sessions);
}

export async function getAllDuas(): Promise<unknown[] | null> {
  return dbGet<unknown[]>("duas:all");
}

export async function setAllDuas(duas: unknown[]): Promise<void> {
  await dbSet("duas:all", duas);
}

export async function getAllNames(): Promise<unknown[] | null> {
  return dbGet<unknown[]>("names:all");
}

export async function setAllNames(names: unknown[]): Promise<void> {
  await dbSet("names:all", names);
}

export async function getNamesOfAllah(): Promise<unknown[] | null> {
  return dbGet<unknown[]>("namesOfAllah:all");
}

export async function setNamesOfAllah(names: unknown[]): Promise<void> {
  await dbSet("namesOfAllah:all", names);
}

export async function getAllHadiths(): Promise<unknown[] | null> {
  return dbGet<unknown[]>("hadiths:all");
}

export async function setAllHadiths(hadiths: unknown[]): Promise<void> {
  await dbSet("hadiths:all", hadiths);
}

export async function getDailyNameOfAllah(): Promise<unknown | null> {
  const names = await getNamesOfAllah();
  if (!names || names.length === 0) return null;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return names[dayOfYear % names.length] ?? null;
}

export async function getDailyHadith(): Promise<unknown | null> {
  const hadiths = await getAllHadiths();
  if (!hadiths || hadiths.length === 0) return null;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return hadiths[dayOfYear % hadiths.length] ?? null;
}

// ─── Favorites helpers ────────────────────────────────────────────────────────

export async function getNameFavs(userId: string): Promise<string[]> {
  const data = await dbGet<{ nameIds: string[] }>(`nameFavs:${userId}`);
  return data?.nameIds ?? [];
}

export async function setNameFavs(userId: string, nameIds: string[]): Promise<void> {
  await dbSet(`nameFavs:${userId}`, { nameIds });
}

export async function getDuaFavs(userId: string): Promise<string[]> {
  const data = await dbGet<{ duaIds: string[] }>(`duaFavs:${userId}`);
  return data?.duaIds ?? [];
}

export async function setDuaFavs(userId: string, duaIds: string[]): Promise<void> {
  await dbSet(`duaFavs:${userId}`, { duaIds });
}

// ─── AI usage helpers ─────────────────────────────────────────────────────────

export async function getAIUsage(userId: string, date: string): Promise<number> {
  const data = await dbGet<{ count: number }>(`aiUsage:${userId}:${date}`);
  return data?.count ?? 0;
}

export async function incrementAIUsage(userId: string, date: string): Promise<void> {
  const count = await getAIUsage(userId, date);
  await dbSet(`aiUsage:${userId}:${date}`, { count: count + 1 });
}

// ─── Room / Gift helpers ──────────────────────────────────────────────────────

export async function getRoom(code: string): Promise<unknown | null> {
  return dbGet(`room:${code}`);
}

export async function setRoom(code: string, data: unknown): Promise<void> {
  await dbSet(`room:${code}`, data);
}

export async function dbListRooms(): Promise<string[]> {
  const data = await dbGet<string[]>("room:__active__");
  return data ?? [];
}

export async function getGift(token: string): Promise<unknown | null> {
  return dbGet(`gift:${token}`);
}

export async function setGift(token: string, data: unknown): Promise<void> {
  await dbSet(`gift:${token}`, data);
}

// ─── Halaqah helpers ──────────────────────────────────────────────────────────

export async function getHalaqah(code: string): Promise<unknown | null> {
  return dbGet(`halaqah:${code}`);
}

export async function setHalaqah(code: string, data: unknown): Promise<void> {
  await dbSet(`halaqah:${code}`, data);
}

// ─── Extended streak fields ───────────────────────────────────────────────────

export async function getStreakExtended(userId: string): Promise<{
  fajrStreak: number;
  ramadanStreak: number;
  perfectDays: number;
} | null> {
  return dbGet(`streakExt:${userId}`);
}

export async function setStreakExtended(
  userId: string,
  data: { fajrStreak: number; ramadanStreak: number; perfectDays: number }
): Promise<void> {
  await dbSet(`streakExt:${userId}`, data);
}

// ─── Blog helpers ──────────────────────────────────────────────────────────────

export interface BlogPostRecord {
  slug: string;
  title: string;
  description: string;
  category: string;
  datePublished: string;
  content_html: string;
  internalLinks: Array<{ href: string; label: string }>;
  wordCount?: number;
  generatedAt?: string;
}

export async function getBlogPost(slug: string): Promise<BlogPostRecord | null> {
  return dbGet<BlogPostRecord>(`blog:${slug}`);
}

export async function setBlogPost(slug: string, post: BlogPostRecord): Promise<void> {
  await dbSet(`blog:${slug}`, post);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const keys = await dbList("blog:");
  return keys.map(k => k.replace("blog:", ""));
}
