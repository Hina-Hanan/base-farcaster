/**
 * Reaction Timer System
 * Handles random delays and reaction time measurement
 */

export interface ReactionTimerConfig {
  minDelay: number; // milliseconds
  maxDelay: number; // milliseconds
}

const DEFAULT_CONFIG: ReactionTimerConfig = {
  minDelay: 1000, // 1 second
  maxDelay: 3000, // 3 seconds
};

/**
 * Generate a random delay between minDelay and maxDelay
 */
export function generateRandomDelay(
  config: ReactionTimerConfig = DEFAULT_CONFIG
): number {
  return (
    Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) +
    config.minDelay
  );
}

/**
 * Calculate reaction time in milliseconds
 */
export function calculateReactionTime(
  startTime: number,
  endTime: number
): number {
  return endTime - startTime;
}

/**
 * Format reaction time for display
 */
export function formatReactionTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Get badge level based on reaction time
 */
export enum BadgeLevel {
  None = 0,
  Bronze = 1,
  Silver = 2,
  Gold = 3,
}

export function getBadgeLevel(reactionTime: number): BadgeLevel {
  if (reactionTime < 300) {
    return BadgeLevel.Gold;
  } else if (reactionTime < 600) {
    return BadgeLevel.Silver;
  } else if (reactionTime < 900) {
    return BadgeLevel.Bronze;
  }
  return BadgeLevel.None;
}

export function getBadgeName(level: BadgeLevel): string {
  switch (level) {
    case BadgeLevel.Gold:
      return "Gold";
    case BadgeLevel.Silver:
      return "Silver";
    case BadgeLevel.Bronze:
      return "Bronze";
    default:
      return "None";
  }
}

export function getBadgeEmoji(level: BadgeLevel): string {
  switch (level) {
    case BadgeLevel.Gold:
      return "🥇";
    case BadgeLevel.Silver:
      return "🥈";
    case BadgeLevel.Bronze:
      return "🥉";
    default:
      return "";
  }
}


