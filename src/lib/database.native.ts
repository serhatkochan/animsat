import * as SQLite from 'expo-sqlite';

import { DEFAULT_CATEGORIES } from '@/src/constants/categories';
import type { AppSettings, BackgroundType, Category, CountdownEvent } from '@/src/types';
import { parseBackgroundImageAdjust } from '@/src/lib/photoTransform';
import { parseWidgetBackgroundImageTransforms } from '@/src/lib/widgetTransforms';
import { resolveEventPhotoUri, deleteEventPhoto } from '@/src/lib/eventPhotoStorage';

const DB_NAME = 'kac_gun_kaldi.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

function parseReminderDays(value: string | null): number[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as number[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseGradientColors(value: string | null): string[] | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value) as string[];
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function mapEvent(row: Record<string, unknown>): CountdownEvent {
  return {
    id: row.id as string,
    title: row.title as string,
    date: row.date as string,
    type: row.type as CountdownEvent['type'],
    repeatYearly: Boolean(row.repeat_yearly),
    categoryId: row.category_id as string,
    color: row.color as string,
    colorSecondary: (row.color_secondary as string) || undefined,
    gradientColors: parseGradientColors(row.gradient_colors as string | null),
    backgroundType: ((row.background_type as BackgroundType) || 'solid') as BackgroundType,
    backgroundImageUri: (row.background_image_uri as string) || undefined,
    backgroundImageTransform: parseBackgroundImageAdjust(
      row.background_image_transform as string | null,
    ),
    widgetBackgroundImageTransform: parseBackgroundImageAdjust(
      row.widget_background_image_transform as string | null,
    ),
    widgetBackgroundImageTransforms: parseWidgetBackgroundImageTransforms(
      row.widget_background_image_transforms as string | null,
      parseBackgroundImageAdjust(row.widget_background_image_transform as string | null),
    ),
    widgetTextScale:
      row.widget_text_scale != null
        ? ((Number(row.widget_text_scale) || 100) as CountdownEvent['widgetTextScale'])
        : row.home_screen_widget_scale != null || row.lock_screen_widget_scale != null
          ? ((Number(row.home_screen_widget_scale ?? row.lock_screen_widget_scale) || 100) as CountdownEvent['widgetTextScale'])
          : 100,
    emoji: (row.emoji as string) || undefined,
    notes: (row.notes as string) || undefined,
    remindersEnabled: row.reminders_enabled == null ? true : Boolean(row.reminders_enabled),
    reminderDays: parseReminderDays(row.reminder_days as string | null),
    location: (row.location as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    color: row.color as string,
    icon: row.icon as string,
  };
}

async function ensureColumn(
  db: SQLite.SQLiteDatabase,
  table: string,
  column: string,
  definition: string,
): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
  if (columns.some((item) => item.name === column)) return;
  await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('countdown', 'countup')),
      repeat_yearly INTEGER NOT NULL DEFAULT 0,
      category_id TEXT NOT NULL,
      color TEXT NOT NULL,
      emoji TEXT,
      notes TEXT,
      reminder_days TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  await ensureColumn(db, 'events', 'color_secondary', 'TEXT');
  await ensureColumn(db, 'events', 'background_type', "TEXT NOT NULL DEFAULT 'solid'");
  await ensureColumn(db, 'events', 'background_image_uri', 'TEXT');
  await ensureColumn(db, 'events', 'reminders_enabled', 'INTEGER NOT NULL DEFAULT 1');
  await ensureColumn(db, 'events', 'gradient_colors', 'TEXT');
  await ensureColumn(db, 'events', 'location', 'TEXT');
  await ensureColumn(db, 'events', 'background_image_transform', 'TEXT');
  await ensureColumn(db, 'events', 'widget_background_image_transform', 'TEXT');
  await ensureColumn(db, 'events', 'widget_background_image_transforms', 'TEXT');
  await ensureColumn(db, 'events', 'home_screen_widget_scale', 'INTEGER');
  await ensureColumn(db, 'events', 'lock_screen_widget_scale', 'INTEGER');
  await ensureColumn(db, 'events', 'widget_text_scale', 'INTEGER');

  const categoryCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories',
  );

  if ((categoryCount?.count ?? 0) === 0) {
    for (const category of DEFAULT_CATEGORIES) {
      await db.runAsync(
        'INSERT INTO categories (id, name, color, icon) VALUES (?, ?, ?, ?)',
        category.id,
        category.name,
        category.color,
        category.icon,
      );
    }
  }

  const settingsCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM settings',
  );

  if ((settingsCount?.count ?? 0) === 0) {
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', 'themeMode', 'dark');
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', 'reminderHour', '9');
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', 'reminderMinute', '0');
  }
}

export async function getAllEvents(): Promise<CountdownEvent[]> {
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT * FROM events ORDER BY created_at DESC');
  const events = rows.map((row) => mapEvent(row as Record<string, unknown>));
  return Promise.all(events.map(resolveEventPhotoUri));
}

export async function getEventById(id: string): Promise<CountdownEvent | null> {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT * FROM events WHERE id = ?', id);
  if (!row) return null;
  return resolveEventPhotoUri(mapEvent(row as Record<string, unknown>));
}

export async function insertEvent(event: CountdownEvent): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO events (
      id, title, date, type, repeat_yearly, category_id, color, color_secondary,
      background_type, background_image_uri, background_image_transform, widget_background_image_transform,
      widget_background_image_transforms, home_screen_widget_scale, lock_screen_widget_scale,
      widget_text_scale, emoji, notes, reminders_enabled,
      reminder_days, gradient_colors, location, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    event.id,
    event.title,
    event.date,
    event.type,
    event.repeatYearly ? 1 : 0,
    event.categoryId,
    event.color,
    event.colorSecondary ?? null,
    event.backgroundType,
    event.backgroundImageUri ?? null,
    event.backgroundImageTransform ? JSON.stringify(event.backgroundImageTransform) : null,
    event.widgetBackgroundImageTransform
      ? JSON.stringify(event.widgetBackgroundImageTransform)
      : null,
    event.widgetBackgroundImageTransforms
      ? JSON.stringify(event.widgetBackgroundImageTransforms)
      : null,
    event.homeScreenWidgetScale ?? null,
    event.lockScreenWidgetScale ?? null,
    event.widgetTextScale ?? null,
    event.emoji ?? null,
    event.notes ?? null,
    event.remindersEnabled ? 1 : 0,
    JSON.stringify(event.reminderDays),
    event.gradientColors ? JSON.stringify(event.gradientColors) : null,
    event.location ?? null,
    event.createdAt,
    event.updatedAt,
  );
}

export async function updateEvent(event: CountdownEvent): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE events SET
      title = ?, date = ?, type = ?, repeat_yearly = ?, category_id = ?,
      color = ?, color_secondary = ?, background_type = ?, background_image_uri = ?,
      background_image_transform = ?, widget_background_image_transform = ?, widget_background_image_transforms = ?,
      home_screen_widget_scale = ?, lock_screen_widget_scale = ?, widget_text_scale = ?,
      emoji = ?, notes = ?, reminders_enabled = ?, reminder_days = ?, gradient_colors = ?,
      location = ?, updated_at = ?
    WHERE id = ?`,
    event.title,
    event.date,
    event.type,
    event.repeatYearly ? 1 : 0,
    event.categoryId,
    event.color,
    event.colorSecondary ?? null,
    event.backgroundType,
    event.backgroundImageUri ?? null,
    event.backgroundImageTransform ? JSON.stringify(event.backgroundImageTransform) : null,
    event.widgetBackgroundImageTransform
      ? JSON.stringify(event.widgetBackgroundImageTransform)
      : null,
    event.widgetBackgroundImageTransforms
      ? JSON.stringify(event.widgetBackgroundImageTransforms)
      : null,
    event.homeScreenWidgetScale ?? null,
    event.lockScreenWidgetScale ?? null,
    event.widgetTextScale ?? null,
    event.emoji ?? null,
    event.notes ?? null,
    event.remindersEnabled ? 1 : 0,
    JSON.stringify(event.reminderDays),
    event.gradientColors ? JSON.stringify(event.gradientColors) : null,
    event.location ?? null,
    event.updatedAt,
    event.id,
  );
}

export async function deleteEvent(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM events WHERE id = ?', id);
  await deleteEventPhoto(id);
}

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT * FROM categories ORDER BY name ASC');
  return rows.map((row) => mapCategory(row as Record<string, unknown>));
}

export async function getSettings(): Promise<AppSettings> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM settings',
  );
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return {
    themeMode: (map.themeMode as AppSettings['themeMode']) ?? 'dark',
    reminderHour: Number(map.reminderHour ?? 9),
    reminderMinute: Number(map.reminderMinute ?? 0),
    pinnedEventId: map.pinnedEventId ? map.pinnedEventId : null,
    cardTextPlacement: (map.cardTextPlacement as AppSettings['cardTextPlacement']) ?? 'center',
    cardTextAlign: (map.cardTextAlign as AppSettings['cardTextAlign']) ?? 'center',
    widgetTextPlacement: map.widgetTextPlacement
      ? (map.widgetTextPlacement as AppSettings['widgetTextPlacement'])
      : null,
    widgetTextAlign: map.widgetTextAlign
      ? (map.widgetTextAlign as AppSettings['widgetTextAlign'])
      : null,
    locale: map.locale ?? 'system',
    hasCompletedOnboarding: map.hasCompletedOnboarding === 'true',
    isPro: true,
    appOpenCount: Number(map.appOpenCount ?? 0),
    proPromptCount: Number(map.proPromptCount ?? 0),
    lastProPromptAt: map.lastProPromptAt || null,
  };
}

export async function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K],
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    key,
    String(value),
  );
}
