"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter, useParams } from "next/navigation";
import { useDisasterPool, useJoinPool, useSubmitReaction, useStartPool } from "@/hooks/useDisasterPool";
import { Address, formatUnits } from "viem";
import { useReadContract, useWriteContract } from "wagmi";
import { ERC20_ABI } from "@/lib/contracts/abis";
import { getContractAddresses } from "@/lib/contracts/addresses";
import { useChainId } from "wagmi";
import { getRandomScenario } from "@/lib/game/disasterScenarios";
import {
  generateRandomDelay,
  calculateReactionTime,
  formatReactionTime,
} from "@/lib/game/reactionTimer";

type GameState = "waiting" | "ready" | "reacting" | "result";

export default function PoolGamePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const params = useParams();
  const poolAddress = params.address as Address;
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);

  const { poolStatus, entryFee, participants, refetch } = useDisasterPool(poolAddress);
  const { joinPool, isPending: isJoining } = useJoinPool();
  const { submitReaction, isPending: isSubmitting } = useSubmitReaction();
  const { startPool, isPending: isStarting } = useStartPool();

  const { writeContract: approveUSDC } = useWriteContract();

  const [gameState, setGameState] = useState<GameState>("waiting");
  const [scenario, setScenario] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const { data: allowance } = useReadContract({
    address: addresses.USDC as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, poolAddress] : undefined,
    query: {
      enabled: !!address && !!addresses.USDC,
    },
  });

  const { data: decimals } = useReadContract({
    address: addresses.USDC as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  // Ensure participants is an array
  const participantsArray = Array.isArray(participants) ? participants : [];

  const isParticipant =
    participantsArray.length > 0 &&
    address &&
    participantsArray.some((p) => p.player.toLowerCase() === address.toLowerCase());

  const hasSubmitted =
    participantsArray.length > 0 &&
    address &&
    participantsArray.some(
      (p) =>
        p.player.toLowerCase() === address.toLowerCase() && p.hasSubmitted
    );

  const isClosed = Array.isArray(poolStatus) && poolStatus[3] ? poolStatus[3] : false;
  const isStarted = Array.isArray(poolStatus) && poolStatus[4] ? poolStatus[4] : false;
  const winner = Array.isArray(poolStatus) && poolStatus[2] ? (poolStatus[2] as Address) : undefined;

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const handleJoin = async () => {
    if (!entryFee || typeof entryFee !== 'bigint' || !decimals) return;

    // Check if approval is needed
    const allowanceValue = allowance && typeof allowance === 'bigint' ? allowance : BigInt(0);
    if (allowanceValue < entryFee) {
      // Approve USDC
      approveUSDC({
        address: addresses.USDC as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [poolAddress, entryFee],
      });
      // Wait a bit then join
      setTimeout(() => {
        joinPool(poolAddress);
      }, 2000);
    } else {
      joinPool(poolAddress);
    }
  };

  const handleStartGame = () => {
    const newScenario = getRandomScenario();
    setScenario(newScenario);
    setGameState("waiting");
    setSelectedOption(null);
    setReactionTime(null);

    const randomDelay = generateRandomDelay();
    setTimeout(() => {
      setGameState("ready");
      setStartTime(Date.now());
    }, randomDelay);
  };

  const handleOptionClick = (optionId: string) => {
    if (gameState !== "ready" || !startTime) return;

    const endTime = Date.now();
    const time = calculateReactionTime(startTime, endTime);
    setReactionTime(time);
    setSelectedOption(optionId);
    setGameState("result");

    const option = scenario?.options.find((opt: any) => opt.id === optionId);
    const isCorrect = option?.isCorrect ?? false;

    if (isCorrect && poolAddress) {
      submitReaction(poolAddress, time);
    }
  };

  if (!isConnected) {
    return null;
  }

  const entryFeeFormatted =
    entryFee && typeof entryFee === 'bigint' && decimals && typeof decimals === 'number' ? formatUnits(entryFee, decimals) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-4">
          <h1 className="text-3xl font-bold mb-4">Pool Game</h1>
          <div className="space-y-2 text-gray-600">
            <p>Entry Fee: {entryFeeFormatted} USDC</p>
            <p>Participants: {Array.isArray(poolStatus) && poolStatus[0] ? poolStatus[0].toString() : "0"}</p>
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
            {winner && (
              <p className="text-green-600 font-bold">Winner: {winner.slice(0, 10)}...</p>
            )}
          </div>
        </div>

        {!isParticipant && !isClosed && (
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <p className="text-gray-600 mb-4">Join this pool to participate</p>
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {isJoining ? "Joining..." : `Join Pool (${entryFeeFormatted} USDC)`}
            </button>
          </div>
        )}

        {isParticipant && !isStarted && !isClosed && address && (
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <p className="text-gray-600 mb-4">Waiting for pool to start...</p>
            {participantsArray.length > 0 && (
              <p className="text-sm text-gray-500">
                {participantsArray.length} participant(s) joined
              </p>
            )}
          </div>
        )}

        {isParticipant && isStarted && !hasSubmitted && !isClosed && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            {gameState === "waiting" && (
              <div className="text-center">
                <button
                  onClick={handleStartGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Start Reaction Test
                </button>
              </div>
            )}

            {gameState === "ready" && scenario && (
              <div className="text-center">
                <div className="text-6xl mb-4">{scenario.icon}</div>
                <h2 className="text-4xl font-bold text-red-600 mb-2 animate-pulse">
                  REACT NOW!
                </h2>
                <h3 className="text-2xl font-semibold mb-2">{scenario.name}</h3>
                <p className="text-lg text-gray-700 mb-6">{scenario.description}</p>

                <div className="space-y-3">
                  {scenario.options.map((option: any) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option.id)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-lg"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gameState === "result" && reactionTime !== null && (
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="text-lg text-gray-700 mb-2">Reaction Time:</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatReactionTime(reactionTime)}
                  </p>
                </div>
                {isSubmitting && (
                  <p className="text-gray-600">Submitting to blockchain...</p>
                )}
              </div>
            )}
          </div>
        )}

        {hasSubmitted && !isClosed && (
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <p className="text-green-600 font-bold mb-2">✓ Reaction Submitted!</p>
            <p className="text-gray-600">Waiting for pool to close...</p>
          </div>
        )}

        {isClosed && (
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <p className="text-red-600 font-bold mb-2">Pool Closed</p>
            {winner && (
              <p className="text-gray-600">
                Winner: {winner.slice(0, 10)}...{winner.slice(-8)}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => router.push("/pools")}
          className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Back to Pools
        </button>
      </div>
    </div>
  );
}


