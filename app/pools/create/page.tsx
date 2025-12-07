"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useCreatePool } from "@/hooks/useDisasterPool";
import { parseUnits } from "viem";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ERC20_ABI } from "@/lib/contracts/abis";
import { getContractAddresses } from "@/lib/contracts/addresses";
import { useChainId } from "wagmi";

export default function CreatePoolPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  const { createPool, isPending, isSuccess } = useCreatePool();

  const [entryFee, setEntryFee] = useState("");
  const [duration, setDuration] = useState("3600"); // 1 hour default

  const { data: decimals } = useReadContract({
    address: addresses.USDC as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  const handleCreate = async () => {
    if (!entryFee || !duration || !decimals) return;
    
    // Ensure decimals is a number
    const decimalsNumber = typeof decimals === 'number' ? decimals : undefined;
    if (!decimalsNumber) return;

    try {
      const entryFeeWei = parseUnits(entryFee, decimalsNumber);
      const durationSeconds = parseInt(duration);
      createPool(entryFeeWei, durationSeconds);
    } catch (error) {
      console.error("Error creating pool:", error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <p className="text-gray-600">Please connect your wallet to create a pool.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-3xl font-bold mb-6">Create Prize Pool</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Fee (USDC)
              </label>
              <input
                type="number"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                placeholder="10"
                min="1"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Amount each participant must pay to join
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="3600"
                min="60"
                step="60"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                How long the pool will be active (minimum 60 seconds)
              </p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => setDuration("3600")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  1 hour
                </button>
                <button
                  onClick={() => setDuration("7200")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  2 hours
                </button>
                <button
                  onClick={() => setDuration("86400")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  24 hours
                </button>
              </div>
            </div>

            {isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">
                  ✓ Pool created successfully!
                </p>
                <button
                  onClick={() => router.push("/pools")}
                  className="mt-2 text-green-600 hover:underline"
                >
                  View pools →
                </button>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreate}
                disabled={isPending || !entryFee || !duration}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Create Pool"}
              </button>
              <button
                onClick={() => router.push("/pools")}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


