/**
 * Test Helper: Contract Setup
 * Provides utilities for setting up test contracts
 */

const { ethers } = require("hardhat");

/**
 * Deploy all contracts for testing
 */
async function deployContracts() {
  const [owner, player1, player2] = await ethers.getSigners();

  // Deploy PlayerStats
  const PlayerStats = await ethers.getContractFactory("PlayerStats");
  const playerStats = await PlayerStats.deploy();
  await playerStats.waitForDeployment();

  // Deploy Mock USDC
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockUSDC = await MockERC20.deploy("USDC", "USDC", 6);
  await mockUSDC.waitForDeployment();

  // Mint USDC to players
  await mockUSDC.mint(player1.address, ethers.parseUnits("1000", 6));
  await mockUSDC.mint(player2.address, ethers.parseUnits("1000", 6));

  // Deploy Factory
  const DisasterPoolFactory = await ethers.getContractFactory(
    "DisasterPoolFactory"
  );
  const poolFactory = await DisasterPoolFactory.deploy(
    await playerStats.getAddress(),
    await mockUSDC.getAddress()
  );
  await poolFactory.waitForDeployment();

  // Deploy ReactionVerifier
  const ReactionVerifier = await ethers.getContractFactory("ReactionVerifier");
  const reactionVerifier = await ReactionVerifier.deploy();
  await reactionVerifier.waitForDeployment();

  return {
    playerStats,
    mockUSDC,
    poolFactory,
    reactionVerifier,
    owner,
    player1,
    player2,
  };
}

/**
 * Create a test pool
 */
async function createTestPool(poolFactory, owner, entryFee = "10", duration = 3600) {
  const entryFeeWei = ethers.parseUnits(entryFee, 6);
  await poolFactory.connect(owner).createPool(entryFeeWei, duration);
  const poolCount = await poolFactory.poolCount();
  const poolAddress = await poolFactory.getPool(poolCount - 1n);
  
  const DisasterPool = await ethers.getContractFactory("DisasterPool");
  return DisasterPool.attach(poolAddress);
}

/**
 * Register a test player
 */
async function registerPlayer(playerStats, player) {
  await playerStats.connect(player).registerPlayer();
  return await playerStats.getPlayerData(player.address);
}

module.exports = {
  deployContracts,
  createTestPool,
  registerPlayer,
};



