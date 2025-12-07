"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { PLAYER_STATS_ABI } from "@/lib/contracts/abis";
import { getContractAddresses } from "@/lib/contracts/addresses";

export function usePlayerStats(address?: string) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const { data: playerData, refetch } = useReadContract({
    address: addresses.PLAYER_STATS as `0x${string}`,
    abi: PLAYER_STATS_ABI,
    functionName: "getPlayerData",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!addresses.PLAYER_STATS,
    },
  });

  return {
    playerData,
    refetch,
  };
}

export function useRegisterPlayer() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const register = () => {
    if (!addresses.PLAYER_STATS) {
      throw new Error("PlayerStats contract address not set");
    }

    writeContract({
      address: addresses.PLAYER_STATS as `0x${string}`,
      abi: PLAYER_STATS_ABI,
      functionName: "registerPlayer",
    });
  };

  return {
    register,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

export function useRecordReaction() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const recordReaction = (reactionTime: number, isWin: boolean) => {
    if (!addresses.PLAYER_STATS) {
      throw new Error("PlayerStats contract address not set");
    }

    writeContract({
      address: addresses.PLAYER_STATS as `0x${string}`,
      abi: PLAYER_STATS_ABI,
      functionName: "recordReaction",
      args: [BigInt(reactionTime), isWin],
    });
  };

  return {
    recordReaction,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

type PlayerData = {
  player: `0x${string}`;
  bestReactionTime: bigint;
  totalGames: bigint;
  totalWins: bigint;
  highestBadge: number;
  lastPlayed: bigint;
};

export function useTopPlayers(limit: number = 10) {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const { data: topPlayers, refetch } = useReadContract({
    address: addresses.PLAYER_STATS as `0x${string}`,
    abi: PLAYER_STATS_ABI,
    functionName: "getTopPlayers",
    args: [BigInt(limit)],
    query: {
      enabled: !!addresses.PLAYER_STATS,
    },
  });

  return {
    topPlayers: (topPlayers as PlayerData[]) || [],
    refetch,
  };
}

