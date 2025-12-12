import { MiniAppNotificationDetails } from "@farcaster/miniapp-sdk";
import { Redis } from "@upstash/redis";

// Initialize Redis with fallback handling
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Helper to check if Redis is available
function isRedisAvailable(): boolean {
  return redis !== null;
}

function getUserNotificationDetailsKey(fid: number): string {
  return `${fid}`;
}

export async function getUserNotificationDetails(
  fid: number
): Promise<MiniAppNotificationDetails | null> {
  if (!isRedisAvailable()) {
    console.warn('⚠️ Redis is not configured. Notification details will not be persisted.');
    return null;
  }
  try {
    return await redis!.get<MiniAppNotificationDetails>(
      getUserNotificationDetailsKey(fid)
    );
  } catch (error) {
    console.error('Error getting user notification details:', error);
    return null;
  }
}

export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: MiniAppNotificationDetails
): Promise<void> {
  if (!isRedisAvailable()) {
    console.warn('⚠️ Redis is not configured. Notification details will not be persisted.');
    return;
  }
  try {
    await redis!.set(getUserNotificationDetailsKey(fid), notificationDetails);
  } catch (error) {
    console.error('Error setting user notification details:', error);
  }
}

export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  if (!isRedisAvailable()) {
    return;
  }
  try {
    await redis!.del(getUserNotificationDetailsKey(fid));
  } catch (error) {
    console.error('Error deleting user notification details:', error);
  }
}