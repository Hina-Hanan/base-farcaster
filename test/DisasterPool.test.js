const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DisasterPool", function () {
  let playerStats;
  let mockUSDC;
  let poolFactory;
  let pool;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    // Deploy PlayerStats
    const PlayerStats = await ethers.getContractFactory("PlayerStats");
    playerStats = await PlayerStats.deploy();
    await playerStats.waitForDeployment();

    // Deploy Mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Mint USDC to players
    await mockUSDC.mint(player1.address, ethers.parseUnits("1000", 6));
    await mockUSDC.mint(player2.address, ethers.parseUnits("1000", 6));

    // Deploy Factory
    const DisasterPoolFactory = await ethers.getContractFactory(
      "DisasterPoolFactory"
    );
    poolFactory = await DisasterPoolFactory.deploy(
      await playerStats.getAddress(),
      await mockUSDC.getAddress()
    );
    await poolFactory.waitForDeployment();

    // Create a pool
    const entryFee = ethers.parseUnits("10", 6);
    const tx = await poolFactory
      .connect(owner)
      .createPool(entryFee, 3600); // 1 hour duration
    const receipt = await tx.wait();
    
    // Get pool address from event or factory
    const poolId = 0;
    const poolAddress = await poolFactory.getPool(poolId);

    const DisasterPool = await ethers.getContractFactory("DisasterPool");
    pool = DisasterPool.attach(poolAddress);
  });

  describe("Pool Creation", function () {
    it("Should create a pool with correct parameters", async function () {
      const entryFee = await pool.entryFee();
      expect(entryFee).to.equal(ethers.parseUnits("10", 6));
    });
  });

  describe("Joining Pool", function () {
    it("Should allow players to join pool", async function () {
      const entryFee = await pool.entryFee();
      await mockUSDC.connect(player1).approve(await pool.getAddress(), entryFee);
      await pool.connect(player1).joinPool();

      const status = await pool.getPoolStatus();
      expect(status[0]).to.equal(1); // 1 participant
    });

    it("Should transfer USDC on join", async function () {
      const entryFee = await pool.entryFee();
      await mockUSDC.connect(player1).approve(await pool.getAddress(), entryFee);
      const balanceBefore = await mockUSDC.balanceOf(player1.address);
      await pool.connect(player1).joinPool();
      const balanceAfter = await mockUSDC.balanceOf(player1.address);
      expect(balanceBefore - balanceAfter).to.equal(entryFee);
    });
  });

  describe("Submitting Reactions", function () {
    beforeEach(async function () {
      const entryFee = await pool.entryFee();
      await mockUSDC.connect(player1).approve(await pool.getAddress(), entryFee);
      await pool.connect(player1).joinPool();
      await pool.connect(owner).startPool();
    });

    it("Should allow submitting reaction time", async function () {
      await pool.connect(player1).submitReaction(250);
      const participants = await pool.getParticipants();
      expect(participants[0].hasSubmitted).to.be.true;
      expect(participants[0].reactionTime).to.equal(250);
    });

    it("Should not allow double submission", async function () {
      await pool.connect(player1).submitReaction(250);
      await expect(
        pool.connect(player1).submitReaction(300)
      ).to.be.revertedWith("Already submitted");
    });
  });

  describe("Closing Pool", function () {
    beforeEach(async function () {
      const entryFee = await pool.entryFee();
      await mockUSDC.connect(player1).approve(await pool.getAddress(), entryFee);
      await mockUSDC.connect(player2).approve(await pool.getAddress(), entryFee);
      await pool.connect(player1).joinPool();
      await pool.connect(player2).joinPool();
      await pool.connect(owner).startPool();
    });

    it("Should determine winner with fastest reaction", async function () {
      await pool.connect(player1).submitReaction(500);
      await pool.connect(player2).submitReaction(200);

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine", []);

      await pool.connect(owner).closePool();
      const winner = await pool.winner();
      expect(winner).to.equal(player2.address);
    });

    it("Should transfer prize to winner", async function () {
      await pool.connect(player1).submitReaction(500);
      await pool.connect(player2).submitReaction(200);

      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine", []);

      const balanceBefore = await mockUSDC.balanceOf(player2.address);
      await pool.connect(owner).closePool();
      const balanceAfter = await mockUSDC.balanceOf(player2.address);
      const entryFee = await pool.entryFee();
      expect(balanceAfter - balanceBefore).to.equal(entryFee * 2n); // 2 participants
    });
  });
});


