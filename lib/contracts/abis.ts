/**
 * Contract ABIs for Disaster Reflex Trainer
 * These will be generated from the compiled contracts
 */

export const PLAYER_STATS_ABI = [
  "function registerPlayer() external",
  "function recordReaction(uint256 reactionTime, bool isWin) external",
  "function getBadgeLevel(uint256 reactionTime) public pure returns (uint8)",
  "function getPlayerData(address player) external view returns (tuple(address player, uint256 bestReactionTime, uint256 totalGames, uint256 totalWins, uint8 highestBadge, uint256 lastPlayed))",
  "function getTotalPlayers() external view returns (uint256)",
  "function getTopPlayers(uint256 limit) external view returns (tuple(address player, uint256 bestReactionTime, uint256 totalGames, uint256 totalWins, uint8 highestBadge, uint256 lastPlayed)[])",
  "event PlayerRegistered(address indexed player)",
  "event ReactionRecorded(address indexed player, uint256 reactionTime, uint8 badge)",
  "event BadgeEarned(address indexed player, uint8 badge)",
] as const;

export const DISASTER_POOL_ABI = [
  "function joinPool() external",
  "function startPool() external",
  "function submitReaction(uint256 reactionTime) external",
  "function closePool() external",
  "function getPoolStatus() external view returns (uint256 participantsCount, uint256 totalPrize, address currentWinner, bool closed, bool started)",
  "function getParticipants() external view returns (tuple(address player, uint256 reactionTime, bool hasSubmitted, uint256 submittedAt)[])",
  "function entryFee() external view returns (uint256)",
  "function isClosed() external view returns (bool)",
  "function isStarted() external view returns (bool)",
  "function winner() external view returns (address)",
  "event PoolStarted(uint256 indexed poolId)",
  "event ParticipantJoined(address indexed player, uint256 indexed poolId)",
  "event ReactionSubmitted(address indexed player, uint256 reactionTime, uint256 indexed poolId)",
  "event PoolClosed(address indexed winner, uint256 reactionTime, uint256 indexed poolId)",
] as const;

export const DISASTER_POOL_FACTORY_ABI = [
  "function createPool(uint256 entryFee, uint256 durationSeconds) external returns (uint256 poolId, address poolAddress)",
  "function getPool(uint256 poolId) external view returns (address)",
  "function getPlayerPools(address player) external view returns (uint256[])",
  "function getActivePools(uint256 limit) external view returns (address[])",
  "function poolCount() external view returns (uint256)",
  "function pools(uint256) external view returns (address)",
  "event PoolCreated(uint256 indexed poolId, address indexed poolAddress, address indexed creator, uint256 entryFee)",
] as const;

export const REACTION_VERIFIER_ABI = [
  "function verifyReaction(address player, uint256 reactionTime, uint256 timestamp, bytes32 nonce, bytes memory signature) external returns (bool isValid)",
  "function isNonceUsed(bytes32 nonce) external view returns (bool)",
  "event ReactionVerified(address indexed player, uint256 reactionTime, uint256 timestamp)",
] as const;

export const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)",
] as const;




