import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import type { CountdownEvent } from '@/src/types';

function photosDir(): string {
  const base = FileSystem.documentDirectory;
  if (!base) {
    throw new Error('documentDirectory kullanılamıyor');
  }
  return `${base}event-backgrounds/`;
}

function stripQuery(uri: string): string {
  return uri.split('?')[0] ?? uri;
}

function normalizeFileUri(uri: string): string {
  const clean = stripQuery(uri);
  return clean.startsWith('file://') ? clean : `file://${clean}`;
}

export function eventPhotoUri(eventId: string, token = Date.now()): string {
  return `${photosDir()}${eventId}-${token}.jpg`;
}

export function isManagedEventPhoto(uri: string): boolean {
  return stripQuery(uri).includes('/event-backgrounds/');
}

async function ensurePhotosDir(): Promise<void> {
  await FileSystem.makeDirectoryAsync(photosDir(), { intermediates: true });
}

async function listEventPhotoUris(eventId: string): Promise<string[]> {
  try {
    const names = await FileSystem.readDirectoryAsync(photosDir());
    return names
      .filter((name) => name === `${eventId}.jpg` || name.startsWith(`${eventId}-`))
      .map((name) => `${photosDir()}${name}`);
  } catch {
    return [];
  }
}

export async function persistedPhotoExists(eventId: string): Promise<boolean> {
  const uris = await listEventPhotoUris(eventId);
  return uris.length > 0;
}

export async function getPersistedEventPhotoUri(eventId: string): Promise<string | null> {
  const uris = await listEventPhotoUris(eventId);
  if (uris.length === 0) return null;
  return uris.sort().at(-1) ?? null;
}

export async function persistEventPhoto(
  eventId: string,
  sourceUri: string,
  previousUri?: string | null,
): Promise<string> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return sourceUri;
  }

  await ensurePhotosDir();
  const destination = eventPhotoUri(eventId);
  const normalizedSource = normalizeFileUri(sourceUri);

  if (normalizedSource === destination) {
    const info = await FileSystem.getInfoAsync(destination);
    if (info.exists) return destination;
  }

  const sourceInfo = await FileSystem.getInfoAsync(normalizedSource);
  if (!sourceInfo.exists) {
    const existing = previousUri
      ? await FileSystem.getInfoAsync(normalizeFileUri(previousUri))
      : { exists: false };
    if (existing.exists && previousUri) return normalizeFileUri(previousUri);
    const fallback = await getPersistedEventPhotoUri(eventId);
    if (fallback) return fallback;
    throw new Error(`Kaynak fotoğraf bulunamadı: ${sourceUri}`);
  }

  try {
    await FileSystem.copyAsync({ from: normalizedSource, to: destination });
  } catch {
    const base64 = await FileSystem.readAsStringAsync(normalizedSource, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await FileSystem.writeAsStringAsync(destination, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  const copied = await FileSystem.getInfoAsync(destination);
  if (!copied.exists) {
    throw new Error('Fotoğraf kaydedilemedi');
  }

  await deleteEventPhoto(eventId, destination);
  return destination;
}

export async function resolveEventPhotoUri(event: CountdownEvent): Promise<CountdownEvent> {
  if (event.backgroundType !== 'photo') return event;

  if (event.backgroundImageUri) {
    const current = normalizeFileUri(event.backgroundImageUri);
    const info = await FileSystem.getInfoAsync(current);
    if (info.exists) {
      if (isManagedEventPhoto(current)) {
        return { ...event, backgroundImageUri: current };
      }
      try {
        const backgroundImageUri = await persistEventPhoto(
          event.id,
          current,
          event.backgroundImageUri,
        );
        return { ...event, backgroundImageUri };
      } catch {
        return { ...event, backgroundImageUri: current };
      }
    }
  }

  const persisted = await getPersistedEventPhotoUri(event.id);
  if (persisted) {
    return { ...event, backgroundImageUri: persisted };
  }

  return { ...event, backgroundImageUri: undefined };
}

export async function deleteEventPhoto(eventId: string, keepUri?: string): Promise<void> {
  const keep = keepUri ? normalizeFileUri(keepUri) : null;
  const uris = await listEventPhotoUris(eventId);
  await Promise.all(
    uris
      .filter((uri) => normalizeFileUri(uri) !== keep)
      .map((uri) => FileSystem.deleteAsync(uri, { idempotent: true })),
  );
}
