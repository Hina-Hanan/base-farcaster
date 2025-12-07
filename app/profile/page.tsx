"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePlayerStats } from "@/hooks/usePlayerStats";
import { formatReactionTime } from "@/lib/game/reactionTimer";
import { getBadgeName, getBadgeEmoji, BadgeLevel } from "@/lib/game/reactionTimer";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { playerData, refetch } = usePlayerStats(address);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (!isConnected) {
    return null;
  }

  const badgeLevel = playerData?.highestBadge as BadgeLevel | undefined;
  const bestTime =
    playerData?.bestReactionTime ===
    BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
      ? null
      : playerData?.bestReactionTime
      ? Number(playerData.bestReactionTime)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Wallet Address</p>
              <p className="font-mono text-sm break-all">{address}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Best Reaction Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {bestTime !== null ? formatReactionTime(bestTime) : "No time yet"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Highest Badge</p>
              {badgeLevel !== undefined && badgeLevel > 0 ? (
                <p className="text-2xl font-bold">
                  {getBadgeEmoji(badgeLevel)} {getBadgeName(badgeLevel)}
                </p>
              ) : (
                <p className="text-gray-400">No badge yet</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Games</p>
                <p className="text-2xl font-bold">
                  {playerData?.totalGames?.toString() ?? "0"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Wins</p>
                <p className="text-2xl font-bold">
                  {playerData?.totalWins?.toString() ?? "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => router.push("/game")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Play Free Game
            </button>
            <button
              onClick={() => router.push("/pools")}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Join Prize Pool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


