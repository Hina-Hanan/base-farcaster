"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { getRandomScenario, type DisasterScenario } from "@/lib/game/disasterScenarios";
import {
  generateRandomDelay,
  calculateReactionTime,
  formatReactionTime,
  getBadgeLevel,
  getBadgeName,
  getBadgeEmoji,
} from "@/lib/game/reactionTimer";
import { useRegisterPlayer, useRecordReaction } from "@/hooks/usePlayerStats";

type GameState = "waiting" | "ready" | "reacting" | "result";

export default function GamePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { register } = useRegisterPlayer();
  const { recordReaction } = useRecordReaction();

  const [gameState, setGameState] = useState<GameState>("waiting");
  const [scenario, setScenario] = useState<DisasterScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [delay, setDelay] = useState<number | null>(null);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const startGame = async () => {
    // Register player if needed
    try {
      register();
    } catch (error) {
      console.error("Error registering player:", error);
    }

    const newScenario = getRandomScenario();
    setScenario(newScenario);
    setGameState("waiting");
    setSelectedOption(null);
    setReactionTime(null);

    // Generate random delay
    const randomDelay = generateRandomDelay();
    setDelay(randomDelay);

    // Wait for delay, then show "REACT NOW!"
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

    // Find the selected option
    const option = scenario?.options.find((opt) => opt.id === optionId);
    const isCorrect = option?.isCorrect ?? false;

    // Record reaction on-chain
    if (isCorrect && address) {
      try {
        recordReaction(time, false); // false for free play
      } catch (error) {
        console.error("Error recording reaction:", error);
      }
    }
  };

  const resetGame = () => {
    setGameState("waiting");
    setScenario(null);
    setSelectedOption(null);
    setReactionTime(null);
    setStartTime(null);
    setDelay(null);
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900/95 to-black/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-900/50 p-6 md:p-8 lg:p-10">
          {gameState === "waiting" && (
            <div className="text-center space-y-6">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Disaster Reflex Trainer
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
              </div>
              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-md mx-auto">
                Get ready! A disaster scenario will appear soon...
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 border border-blue-400/20"
              >
                Start Game
              </button>
            </div>
          )}

          {gameState === "ready" && scenario && (
            <div className="text-center space-y-6">
              <div className="text-7xl md:text-8xl mb-6 animate-bounce">{scenario.icon}</div>
              <h2 className="text-4xl md:text-5xl font-bold text-red-400 mb-3 animate-pulse drop-shadow-lg shadow-red-500/50">
                REACT NOW!
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white">{scenario.name}</h3>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {scenario.description}
              </p>

              <div className="space-y-4 mt-8">
                {scenario.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option.id)}
                    className="w-full bg-gradient-to-r from-blue-900/80 to-blue-800/80 hover:from-blue-800 hover:to-blue-700 text-white font-semibold py-5 px-6 rounded-xl text-lg md:text-xl transition-all duration-300 transform hover:scale-[1.02] border border-blue-500/30 hover:border-blue-400/50 shadow-lg shadow-blue-900/20 hover:shadow-blue-700/40 active:scale-[0.98]"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState === "result" && scenario && reactionTime !== null && (
            <div className="text-center space-y-6">
              <div className="text-7xl md:text-8xl mb-6">{scenario.icon}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{scenario.name}</h2>

              {selectedOption && (
                <>
                  {(() => {
                    const option = scenario.options.find(
                      (opt) => opt.id === selectedOption
                    );
                    const isCorrect = option?.isCorrect ?? false;
                    const badge = getBadgeLevel(reactionTime);

                    return (
                      <>
                        <div
                          className={`text-5xl md:text-6xl font-bold mb-6 ${
                            isCorrect 
                              ? "text-green-400 drop-shadow-lg shadow-green-500/50" 
                              : "text-red-400 drop-shadow-lg shadow-red-500/50"
                          }`}
                        >
                          {isCorrect ? "✓ Correct!" : "✗ Wrong!"}
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/60 to-slate-900/60 rounded-xl p-6 mb-6 border border-blue-500/20 shadow-xl">
                          <p className="text-lg md:text-xl text-gray-300 mb-3">
                            Reaction Time:
                          </p>
                          <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                            {formatReactionTime(reactionTime)}
                          </p>
                        </div>

                        {badge > 0 && (
                          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 rounded-xl p-6 mb-6 border border-yellow-500/30 shadow-xl">
                            <p className="text-lg md:text-xl text-gray-300 mb-2">Badge Earned:</p>
                            <p className="text-3xl md:text-4xl font-bold text-yellow-400">
                              {getBadgeEmoji(badge)} {getBadgeName(badge)}
                            </p>
                          </div>
                        )}

                        {!isCorrect && (
                          <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 rounded-xl p-6 mb-6 border border-red-500/20 shadow-xl">
                            <p className="text-red-300 text-lg">
                              The correct answer was:{" "}
                              <strong className="text-red-200">
                                {
                                  scenario.options.find((opt) => opt.isCorrect)
                                    ?.text
                                }
                              </strong>
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 border border-blue-400/20"
                >
                  Play Again
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-slate-900/50 hover:shadow-slate-800/50 transition-all duration-300 transform hover:scale-105 border border-slate-600/20"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


