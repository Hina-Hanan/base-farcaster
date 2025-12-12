/**
 * End-to-End Test: Complete Game Flow
 * 
 * This test simulates the complete flow:
 * 1. Player registration
 * 2. Free play game
 * 3. Pool creation
 * 4. Pool joining
 * 5. Reaction submission
 * 6. Pool closing
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("E2E: Complete Game Flow", function () {
  let playerStats;
  let mockUSDC;
  let poolFactory;
  let pool;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    // Deploy all contracts
    const PlayerStats = await ethers.getContractFactory("PlayerStats");
    playerStats = await PlayerStats.deploy();
    await playerStats.waitForDeployment();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Mint USDC
    await mockUSDC.mint(player1.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(player2.address, ethers.parseUnits("1000", 6));

    const DisasterPoolFactory = await ethers.getContractFactory(
      "DisasterPoolFactory"
    );
    poolFactory = await DisasterPoolFactory.deploy(
      await playerStats.getAddress(),
      await mockUSDC.getAddress()
    );
    await poolFactory.waitForDeployment();
  });

  it("Should complete full game flow", async function () {
    // Step 1: Register players
    await playerStats.connect(player1).registerPlayer();
    await playerStats.connect(player2).registerPlayer();

    let playerData1 = await playerStats.getPlayerData(player1.address);
    expect(playerData1.player).to.equal(player1.address);
    expect(playerData1.totalGames).to.equal(0);

    // Step 2: Play free game (record reaction)
    await playerStats.connect(player1).recordReaction(250, false);
    playerData1 = await playerStats.getPlayerData(player1.address);
    expect(playerData1.totalGames).to.equal(1);
    expect(playerData1.bestReactionTime).to.equal(250);
    expect(playerData1.highestBadge).to.equal(3); // Gold badge

    // Step 3: Create a prize pool
    const entryFee = ethers.parseUnits("10", 6);
    await poolFactory.connect(owner).createPool(entryFee, 3600);
    const poolAddress = await poolFactory.getPool(0);
    const DisasterPool = await ethers.getContractFactory("DisasterPool");
    pool = DisasterPool.attach(poolAddress);

    // Step 4: Players join pool
    await mockUSDC.connect(player1).approve(poolAddress, entryFee);
    await mockUSDC.connect(player2).approve(poolAddress, entryFee);
    
    await pool.connect(player1).joinPool();
    await pool.connect(player2).joinPool();

    let status = await pool.getPoolStatus();
    expect(status[0]).to.equal(2); // 2 participants

    // Step 5: Start pool
    await pool.connect(owner).startPool();
    status = await pool.getPoolStatus();
    expect(status[4]).to.be.true; // isStarted

    // Step 6: Submit reactions
    await pool.connect(player1).submitReaction(200);
    await pool.connect(player2).submitReaction(300);

    const participants = await pool.getParticipants();
    expect(participants[0].hasSubmitted).to.be.true;
    expect(participants[1].hasSubmitted).to.be.true;

    // Step 7: Close pool and determine winner
    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    await pool.connect(owner).closePool();
    
    const winner = await pool.winner();
    expect(winner).to.equal(player1.address); // Fastest reaction

    status = await pool.getPoolStatus();
    expect(status[3]).to.be.true; // isClosed

    // Step 8: Verify leaderboard
    const topPlayers = await playerStats.getTopPlayers(10);
    expect(topPlayers.length).to.be.greaterThan(0);
    expect(topPlayers[0].player).to.equal(player1.address);
  });

  it("Should handle multiple games and update stats", async function () {
    // Register and play multiple games
    await playerStats.connect(player1).registerPlayer();
    
    await playerStats.connect(player1).recordReaction(500, false);
    await playerStats.connect(player1).recordReaction(300, false);
    await playerStats.connect(player1).recordReaction(200, false);

    const playerData = await playerStats.getPlayerData(player1.address);
    expect(playerData.totalGames).to.equal(3);
    expect(playerData.bestReactionTime).to.equal(200); // Best time
    expect(playerData.highestBadge).to.equal(3); // Gold badge
  });

  it("Should handle pool with single participant", async function () {
    await playerStats.connect(player1).registerPlayer();

    const entryFee = ethers.parseUnits("10", 6);
    await poolFactory.connect(owner).createPool(entryFee, 3600);
    const poolAddress = await poolFactory.getPool(0);
    const DisasterPool = await ethers.getContractFactory("DisasterPool");
    pool = DisasterPool.attach(poolAddress);

    await mockUSDC.connect(player1).approve(poolAddress, entryFee);
    await pool.connect(player1).joinPool();
    await pool.connect(owner).startPool();
    await pool.connect(player1).submitReaction(250);

    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    await pool.connect(owner).closePool();
    
    const winner = await pool.winner();
    expect(winner).to.equal(player1.address);
  });
});



