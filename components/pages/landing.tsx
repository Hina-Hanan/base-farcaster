"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { useRegisterPlayer } from "@/hooks/usePlayerStats";
import { useAppKit } from "@reown/appkit/react";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { useFrame } from "@/components/farcaster-provider";

export default function LandingPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { register } = useRegisterPlayer();
  const appKit = useAppKit();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { isEthProviderAvailable } = useFrame();

  const handleConnectWallet = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    console.log("🔵 Connect wallet clicked", { 
      isEthProviderAvailable, 
      appKitExists: !!appKit,
      hasOpen: !!appKit?.open,
      openType: typeof appKit?.open,
      isConnecting 
    });
    
    try {
      if (isEthProviderAvailable) {
        // Inside Warpcast MiniApp: use the Farcaster connector
        console.log("✅ Using Farcaster connector");
        connect({ connector: miniAppConnector() });
      } else {
        // On the web: open the WalletConnect/AppKit modal
        console.log("🌐 Opening AppKit modal");
        
        // Try multiple ways to open the modal
        if (appKit?.open && typeof appKit.open === 'function') {
          console.log("✅ Calling appKit.open()");
          appKit.open();
        } else if (appKit && 'open' in appKit) {
          console.log("⚠️ AppKit exists but open might not be a function");
          (appKit as any).open?.();
        } else {
          console.error("❌ AppKit not available");
          // Fallback: try using wagmi's injected connector
          try {
            console.log("🔄 Trying injected connector fallback");
            const { injected } = await import('wagmi/connectors');
            connect({ connector: injected() });
          } catch (fallbackError) {
            console.error("❌ Fallback connection failed:", fallbackError);
            alert("Wallet connection not available.\n\nPlease:\n1. Refresh the page\n2. Install a wallet extension (MetaMask, Coinbase Wallet, etc.)\n3. Check browser console (F12) for errors");
          }
        }
      }
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
      alert(`Error connecting wallet: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck browser console (F12) for details.`);
    }
  };

  const handleConnectAndPlay = async () => {
    if (!isConnected) {
      // Wallet connection will be handled by the wallet provider
      return;
    }

    // Register player on first visit
    try {
      register();
    } catch (error) {
      console.error("Error registering player:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900">
      {/* Navbar with Wallet Connection */}
      <nav className="w-full bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">🚨 Disaster Reflex Trainer</h2>
            {isConnected && address ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/80 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button
                  onClick={() => router.push("/profile")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Profile
                </button>
                <button
                  onClick={() => disconnect()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            🚨 Disaster Reflex Trainer
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Test your reflexes in disaster scenarios. React fast and win prizes!
          </p>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-lg mb-2">🎮 Free Play Mode</h3>
                <p className="text-gray-600">
                  Practice your reflexes with random disaster scenarios. Earn badges and compete on the leaderboard!
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">💰 Prize Pool Mode</h3>
                <p className="text-gray-600">
                  Join pools by depositing USDC. Fastest correct reaction wins the prize pool!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Disaster Scenarios</h2>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-semibold">Earthquake</h3>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="font-semibold">Fire</h3>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🌊</div>
                <h3 className="font-semibold">Flood</h3>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">💨</div>
                <h3 className="font-semibold">Gas Leak</h3>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold">Lightning</h3>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isConnected ? (
              <>
                <button
                  onClick={() => {
                    handleConnectAndPlay();
                    router.push("/game");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg"
                >
                  🎮 Free Play
                </button>
                <button
                  onClick={() => router.push("/pools")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg"
                >
                  💰 Prize Pools
                </button>
                <button
                  onClick={() => router.push("/leaderboard")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-lg text-lg"
                >
                  🏆 Leaderboard
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg"
                >
                  👤 Profile
                </button>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-xl p-6">
                <p className="text-gray-600 mb-4 text-center">
                  Connect your wallet to start playing!
                </p>
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                >
                  {isConnecting ? "Connecting..." : "🔗 Connect Wallet"}
                </button>
                {isConnected && address && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 text-center">
                      Connected: {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


