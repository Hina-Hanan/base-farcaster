const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReactionVerifier", function () {
  let reactionVerifier;
  let owner;
  let player1;

  beforeEach(async function () {
    [owner, player1] = await ethers.getSigners();

    const ReactionVerifier = await ethers.getContractFactory("ReactionVerifier");
    reactionVerifier = await ReactionVerifier.deploy();
    await reactionVerifier.waitForDeployment();
  });

  describe("Reaction Verification", function () {
    it("Should verify a valid reaction", async function () {
      const reactionTime = 250;
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = ethers.randomBytes(32);

      // Create message hash
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "bytes32"],
        [player1.address, reactionTime, timestamp, nonce]
      );
      const ethSignedMessageHash = ethers.solidityPackedKeccak256(
        ["string", "bytes32"],
        ["\x19Ethereum Signed Message:\n32", messageHash]
      );

      // Sign message
      const signature = await player1.signMessage(ethers.getBytes(messageHash));

      // Verify
      const isValid = await reactionVerifier.verifyReaction(
        player1.address,
        reactionTime,
        timestamp,
        nonce,
        signature
      );

      expect(isValid).to.be.true;
    });

    it("Should reject reused nonce", async function () {
      const reactionTime = 250;
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = ethers.randomBytes(32);

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "bytes32"],
        [player1.address, reactionTime, timestamp, nonce]
      );
      const signature = await player1.signMessage(ethers.getBytes(messageHash));

      // First verification should succeed
      await reactionVerifier.verifyReaction(
        player1.address,
        reactionTime,
        timestamp,
        nonce,
        signature
      );

      // Second verification with same nonce should fail
      await expect(
        reactionVerifier.verifyReaction(
          player1.address,
          reactionTime,
          timestamp,
          nonce,
          signature
        )
      ).to.be.revertedWith("Nonce already used");
    });

    it("Should reject old timestamps", async function () {
      const reactionTime = 250;
      const oldTimestamp = Math.floor(Date.now() / 1000) - 400; // 400 seconds ago
      const nonce = ethers.randomBytes(32);

      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "bytes32"],
        [player1.address, reactionTime, oldTimestamp, nonce]
      );
      const signature = await player1.signMessage(ethers.getBytes(messageHash));

      await expect(
        reactionVerifier.verifyReaction(
          player1.address,
          reactionTime,
          oldTimestamp,
          nonce,
          signature
        )
      ).to.be.revertedWith("Submission too old");
    });
  });
});

