"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useDisasterPoolFactory, useDisasterPool, useJoinPool } from "@/hooks/useDisasterPool";
import { Address, formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { ERC20_ABI } from "@/lib/contracts/abis";
import { getContractAddresses } from "@/lib/contracts/addresses";
import { useChainId } from "wagmi";

export default function PoolsPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  const { activePools, refetchActivePools } = useDisasterPoolFactory();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchActivePools();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [refetchActivePools]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Prize Pools</h1>
            <button
              onClick={() => router.push("/pools/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Create Pool
            </button>
          </div>
          <p className="text-gray-600">
            Join a pool by depositing USDC. Fastest reaction wins the prize!
          </p>
        </div>

        {activePools && activePools.length > 0 ? (
          <div className="space-y-4">
            {(activePools as Address[]).map((poolAddress, index) => (
              <PoolCard key={index} poolAddress={poolAddress} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <p className="text-gray-600">No active pools available.</p>
            <button
              onClick={() => router.push("/pools/create")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Create First Pool
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PoolCard({ poolAddress }: { poolAddress: Address }) {
  const router = useRouter();
  const { poolStatus, entryFee, refetch } = useDisasterPool(poolAddress);
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const { data: decimals } = useReadContract({
    address: addresses.USDC as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  const entryFeeFormatted =
    entryFee && decimals
      ? formatUnits(entryFee, decimals)
      : "0";

  const participantsCount = poolStatus?.[0] ?? 0;
  const totalPrize = poolStatus?.[1] ?? 0n;
  const isClosed = poolStatus?.[3] ?? false;
  const isStarted = poolStatus?.[4] ?? false;

  const totalPrizeFormatted =
    totalPrize && decimals
      ? formatUnits(totalPrize, decimals)
      : "0";

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold mb-2">Pool #{poolAddress.slice(0, 8)}...</h3>
          <div className="space-y-1 text-gray-600">
            <p>Entry Fee: {entryFeeFormatted} USDC</p>
            <p>Participants: {participantsCount.toString()}</p>
            <p>Total Prize: {totalPrizeFormatted} USDC</p>
            <p>
              Status:{" "}
              <span
                className={`font-semibold ${
                  isClosed
                    ? "text-red-600"
                    : isStarted
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {isClosed ? "Closed" : isStarted ? "Active" : "Waiting"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isClosed && (
            <button
              onClick={() => router.push(`/pools/${poolAddress}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              {isStarted ? "View" : "Join"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}




