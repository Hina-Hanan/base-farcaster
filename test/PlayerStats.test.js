const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlayerStats", function () {
  let playerStats;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    const PlayerStats = await ethers.getContractFactory("PlayerStats");
    playerStats = await PlayerStats.deploy();
    await playerStats.waitForDeployment();
  });

  describe("Player Registration", function () {
    it("Should register a new player", async function () {
      await playerStats.connect(player1).registerPlayer();
      const playerData = await playerStats.getPlayerData(player1.address);
      expect(playerData.player).to.equal(player1.address);
      expect(playerData.totalGames).to.equal(0);
    });

    it("Should emit PlayerRegistered event", async function () {
      await expect(playerStats.connect(player1).registerPlayer())
        .to.emit(playerStats, "PlayerRegistered")
        .withArgs(player1.address);
    });
  });

  describe("Reaction Recording", function () {
    beforeEach(async function () {
      await playerStats.connect(player1).registerPlayer();
    });

    it("Should record a reaction time", async function () {
      await playerStats.connect(player1).recordReaction(250, false);
      const playerData = await playerStats.getPlayerData(player1.address);
      expect(playerData.totalGames).to.equal(1);
      expect(playerData.bestReactionTime).to.equal(250);
    });

    it("Should update best reaction time", async function () {
      await playerStats.connect(player1).recordReaction(500, false);
      await playerStats.connect(player1).recordReaction(200, false);
      const playerData = await playerStats.getPlayerData(player1.address);
      expect(playerData.bestReactionTime).to.equal(200);
    });

    it("Should award Gold badge for < 300ms", async function () {
      await playerStats.connect(player1).recordReaction(250, false);
      const playerData = await playerStats.getPlayerData(player1.address);
      expect(playerData.highestBadge).to.equal(3); // Gold
    });

    it("Should award Silver badge for 300-600ms", async function () {
      await playerStats.connect(player1).recordReaction(450, false);
      const playerData = await playerStats.getPlayerData(player1.address);
      expect(playerData.highestBadge).to.equal(2); // Silver
    });

    it("Should award Bronze badge for 600-900ms", async function () {
      await playerStats.connect(player1).recordReaction(750, false);
      const playerData = await playerStats.getPlayerData(player1.address);
      expect(playerData.highestBadge).to.equal(1); // Bronze
    });

    it("Should not award badge for > 900ms", async function () {
      await playerStats.connect(player1).recordReaction(1000, false);
      const playerData = await playerStats.getPlayerData(player1.address);
      expect(playerData.highestBadge).to.equal(0); // None
    });

    it("Should increment total wins", async function () {
      await playerStats.connect(player1).recordReaction(250, true);
      const playerData = await playerStats.getPlayerData(player1.address);
      expect(playerData.totalWins).to.equal(1);
    });
  });

  describe("Leaderboard", function () {
    beforeEach(async function () {
      await playerStats.connect(player1).registerPlayer();
      await playerStats.connect(player2).registerPlayer();
      await playerStats.connect(player1).recordReaction(500, false);
      await playerStats.connect(player2).recordReaction(200, false);
    });

    it("Should return top players sorted by best reaction time", async function () {
      const topPlayers = await playerStats.getTopPlayers(10);
      expect(topPlayers.length).to.equal(2);
      expect(topPlayers[0].player).to.equal(player2.address);
      expect(topPlayers[0].bestReactionTime).to.equal(200);
      expect(topPlayers[1].player).to.equal(player1.address);
      expect(topPlayers[1].bestReactionTime).to.equal(500);
    });
  });
});


