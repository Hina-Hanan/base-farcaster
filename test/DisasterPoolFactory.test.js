const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DisasterPoolFactory", function () {
  let playerStats;
  let mockUSDC;
  let poolFactory;
  let owner;
  let player1;

  beforeEach(async function () {
    [owner, player1] = await ethers.getSigners();

    // Deploy PlayerStats
    const PlayerStats = await ethers.getContractFactory("PlayerStats");
    playerStats = await PlayerStats.deploy();
    await playerStats.waitForDeployment();

    // Deploy Mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Deploy Factory
    const DisasterPoolFactory = await ethers.getContractFactory(
      "DisasterPoolFactory"
    );
    poolFactory = await DisasterPoolFactory.deploy(
      await playerStats.getAddress(),
      await mockUSDC.getAddress()
    );
    await poolFactory.waitForDeployment();
  });

  describe("Pool Creation", function () {
    it("Should create a new pool", async function () {
      const entryFee = ethers.parseUnits("10", 6);
      const tx = await poolFactory.connect(owner).createPool(entryFee, 3600);
      await tx.wait();

      const poolCount = await poolFactory.poolCount();
      expect(poolCount).to.equal(1);

      const poolAddress = await poolFactory.getPool(0);
      expect(poolAddress).to.not.equal(ethers.ZeroAddress);
    });

    it("Should emit PoolCreated event", async function () {
      const entryFee = ethers.parseUnits("10", 6);
      await expect(poolFactory.connect(owner).createPool(entryFee, 3600))
        .to.emit(poolFactory, "PoolCreated")
        .withArgs(0, await poolFactory.getPool(0), owner.address, entryFee);
    });

    it("Should reject zero entry fee", async function () {
      await expect(
        poolFactory.connect(owner).createPool(0, 3600)
      ).to.be.revertedWith("Entry fee must be greater than 0");
    });

    it("Should reject duration less than 60 seconds", async function () {
      const entryFee = ethers.parseUnits("10", 6);
      await expect(
        poolFactory.connect(owner).createPool(entryFee, 30)
      ).to.be.revertedWith("Duration must be at least 60 seconds");
    });
  });

  describe("Pool Management", function () {
    beforeEach(async function () {
      const entryFee = ethers.parseUnits("10", 6);
      await poolFactory.connect(owner).createPool(entryFee, 3600);
    });

    it("Should return active pools", async function () {
      const activePools = await poolFactory.getActivePools(10);
      expect(activePools.length).to.equal(1);
    });

    it("Should track player pools", async function () {
      const playerPools = await poolFactory.getPlayerPools(owner.address);
      expect(playerPools.length).to.equal(1);
      expect(playerPools[0]).to.equal(0);
    });
  });
});

