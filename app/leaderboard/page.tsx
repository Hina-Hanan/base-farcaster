"use client";

import { useEffect } from "react";
import { useTopPlayers } from "@/hooks/usePlayerStats";
import { formatReactionTime } from "@/lib/game/reactionTimer";
import { getBadgeName, getBadgeEmoji, BadgeLevel } from "@/lib/game/reactionTimer";

export default function LeaderboardPage() {
  const { topPlayers, refetch } = useTopPlayers(20);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  // Ensure topPlayers is an array
  const players = Array.isArray(topPlayers) ? topPlayers : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

          {players.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold">Player</th>
                    <th className="text-left py-3 px-4 font-semibold">Best Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Badge</th>
                    <th className="text-left py-3 px-4 font-semibold">Games</th>
                    <th className="text-left py-3 px-4 font-semibold">Wins</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index: number) => {
                    const badgeLevel = player.highestBadge as BadgeLevel;
                    const bestTime =
                      player.bestReactionTime ===
                      BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
                        ? null
                        : Number(player.bestReactionTime);

                    return (
                      <tr
                        key={player.player}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {player.player.slice(0, 6)}...{player.player.slice(-4)}
                        </td>
                        <td className="py-3 px-4">
                          {bestTime !== null ? (
                            <span className="font-semibold text-blue-600">
                              {formatReactionTime(bestTime)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {badgeLevel > 0 ? (
                            <span className="font-semibold">
                              {getBadgeEmoji(badgeLevel)} {getBadgeName(badgeLevel)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">{player.totalGames.toString()}</td>
                        <td className="py-3 px-4">{player.totalWins.toString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No players yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


