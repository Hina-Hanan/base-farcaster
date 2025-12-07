/**
 * Contract addresses on Base mainnet
 * Update these after deployment
 */

export const CONTRACT_ADDRESSES = {
  // Base Mainnet
  8453: {
    PLAYER_STATS: process.env.NEXT_PUBLIC_PLAYER_STATS_ADDRESS || "",
    DISASTER_POOL_FACTORY:
      process.env.NEXT_PUBLIC_DISASTER_POOL_FACTORY_ADDRESS || "",
    REACTION_VERIFIER:
      process.env.NEXT_PUBLIC_REACTION_VERIFIER_ADDRESS || "",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base mainnet USDC
  },
  // Base Sepolia
  84532: {
    PLAYER_STATS: process.env.NEXT_PUBLIC_PLAYER_STATS_ADDRESS || "",
    DISASTER_POOL_FACTORY:
      process.env.NEXT_PUBLIC_DISASTER_POOL_FACTORY_ADDRESS || "",
    REACTION_VERIFIER:
      process.env.NEXT_PUBLIC_REACTION_VERIFIER_ADDRESS || "",
    USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || "", // Mock USDC for testnet
  },
} as const;

/**
 * Get contract address for current chain
 */
export function getContractAddresses(chainId: number) {
  return (
    CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] ||
    CONTRACT_ADDRESSES[8453]
  );
}


