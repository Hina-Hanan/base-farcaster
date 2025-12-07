const hre = require("hardhat");

async function main() {
  console.log("Deploying Disaster Reflex Trainer contracts to Base...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // USDC address on Base mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
  // For testing, you might want to use a mock ERC20
  const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  // Deploy PlayerStats
  console.log("Deploying PlayerStats...");
  const PlayerStats = await hre.ethers.getContractFactory("PlayerStats");
  const playerStats = await PlayerStats.deploy();
  await playerStats.waitForDeployment();
  const playerStatsAddress = await playerStats.getAddress();
  console.log("PlayerStats deployed to:", playerStatsAddress);

  // Deploy ReactionVerifier
  console.log("Deploying ReactionVerifier...");
  const ReactionVerifier = await hre.ethers.getContractFactory("ReactionVerifier");
  const reactionVerifier = await ReactionVerifier.deploy();
  await reactionVerifier.waitForDeployment();
  const reactionVerifierAddress = await reactionVerifier.getAddress();
  console.log("ReactionVerifier deployed to:", reactionVerifierAddress);

  // Deploy DisasterPoolFactory
  console.log("Deploying DisasterPoolFactory...");
  const DisasterPoolFactory = await hre.ethers.getContractFactory("DisasterPoolFactory");
  const factory = await DisasterPoolFactory.deploy(playerStatsAddress, USDC_ADDRESS);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("DisasterPoolFactory deployed to:", factoryAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", hre.network.name);
  console.log("PlayerStats:", playerStatsAddress);
  console.log("ReactionVerifier:", reactionVerifierAddress);
  console.log("DisasterPoolFactory:", factoryAddress);
  console.log("USDC Token:", USDC_ADDRESS);

  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    contracts: {
      PlayerStats: playerStatsAddress,
      ReactionVerifier: reactionVerifierAddress,
      DisasterPoolFactory: factoryAddress,
      USDC: USDC_ADDRESS,
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    `deployments/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment info saved to deployments/" + hre.network.name + ".json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


