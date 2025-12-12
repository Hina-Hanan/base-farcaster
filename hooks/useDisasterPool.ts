"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { DISASTER_POOL_ABI, DISASTER_POOL_FACTORY_ABI } from "@/lib/contracts/abis";
import { getContractAddresses } from "@/lib/contracts/addresses";
import { Address } from "viem";

type Participant = {
  player: `0x${string}`;
  reactionTime: bigint;
  hasSubmitted: boolean;
  submittedAt: bigint;
};

type PoolStatus = [bigint, bigint, `0x${string}`, boolean, boolean];

export function useDisasterPool(poolAddress?: Address) {
  const chainId = useChainId();

  const { data: poolStatus, refetch } = useReadContract({
    address: poolAddress,
    abi: DISASTER_POOL_ABI,
    functionName: "getPoolStatus",
    query: {
      enabled: !!poolAddress,
    },
  });

  const { data: participants } = useReadContract({
    address: poolAddress,
    abi: DISASTER_POOL_ABI,
    functionName: "getParticipants",
    query: {
      enabled: !!poolAddress,
    },
  });

  const { data: entryFee } = useReadContract({
    address: poolAddress,
    abi: DISASTER_POOL_ABI,
    functionName: "entryFee",
    query: {
      enabled: !!poolAddress,
    },
  });

  return {
    poolStatus: poolStatus as PoolStatus | undefined,
    participants: (participants as Participant[]) || [],
    entryFee: entryFee as bigint | undefined,
    refetch,
  };
}

export function useJoinPool() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const joinPool = (poolAddress: Address) => {
    writeContract({
      address: poolAddress,
      abi: DISASTER_POOL_ABI,
      functionName: "joinPool",
    });
  };

  return {
    joinPool,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

export function useSubmitReaction() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const submitReaction = (poolAddress: Address, reactionTime: number) => {
    writeContract({
      address: poolAddress,
      abi: DISASTER_POOL_ABI,
      functionName: "submitReaction",
      args: [BigInt(reactionTime)],
    });
  };

  return {
    submitReaction,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

export function useStartPool() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const startPool = (poolAddress: Address) => {
    writeContract({
      address: poolAddress,
      abi: DISASTER_POOL_ABI,
      functionName: "startPool",
    });
  };

  return {
    startPool,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

export function useDisasterPoolFactory() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const { data: poolCount } = useReadContract({
    address: addresses.DISASTER_POOL_FACTORY as `0x${string}`,
    abi: DISASTER_POOL_FACTORY_ABI,
    functionName: "poolCount",
    query: {
      enabled: !!addresses.DISASTER_POOL_FACTORY,
    },
  });

  const { data: activePools, refetch: refetchActivePools } = useReadContract({
    address: addresses.DISASTER_POOL_FACTORY as `0x${string}`,
    abi: DISASTER_POOL_FACTORY_ABI,
    functionName: "getActivePools",
    args: [BigInt(20)],
    query: {
      enabled: !!addresses.DISASTER_POOL_FACTORY,
    },
  });

  return {
    poolCount: poolCount as bigint | undefined,
    activePools: (activePools as Address[]) || [],
    refetchActivePools,
  };
}

export function useCreatePool() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const createPool = (entryFee: bigint, durationSeconds: number) => {
    if (!addresses.DISASTER_POOL_FACTORY) {
      throw new Error("DisasterPoolFactory contract address not set");
    }

    writeContract({
      address: addresses.DISASTER_POOL_FACTORY as `0x${string}`,
      abi: DISASTER_POOL_FACTORY_ABI,
      functionName: "createPool",
      args: [entryFee, BigInt(durationSeconds)],
    });
  };

  return {
    createPool,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

