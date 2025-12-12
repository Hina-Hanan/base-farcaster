#!/bin/bash

# Deploy contracts using Foundry
# Usage: ./scripts/deploy-foundry.sh [network]

NETWORK=${1:-baseSepolia}
RPC_URL=${BASE_RPC_URL:-https://sepolia.base.org}

if [ "$NETWORK" = "base" ]; then
  RPC_URL=${BASE_RPC_URL:-https://mainnet.base.org}
fi

echo "Deploying to $NETWORK..."

# USDC address on Base mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
# USDC address on Base Sepolia: Use mock or deploy one
USDC_ADDRESS=${USDC_ADDRESS:-"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}

# Deploy PlayerStats
echo "Deploying PlayerStats..."
PLAYER_STATS=$(forge create contracts/PlayerStats.sol:PlayerStats \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --json | jq -r '.deployedTo')

echo "PlayerStats deployed to: $PLAYER_STATS"

# Deploy ReactionVerifier
echo "Deploying ReactionVerifier..."
REACTION_VERIFIER=$(forge create contracts/ReactionVerifier.sol:ReactionVerifier \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --json | jq -r '.deployedTo')

echo "ReactionVerifier deployed to: $REACTION_VERIFIER"

# Deploy DisasterPoolFactory
echo "Deploying DisasterPoolFactory..."
FACTORY=$(forge create contracts/DisasterPoolFactory.sol:DisasterPoolFactory \
  --constructor-args $PLAYER_STATS $USDC_ADDRESS \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --json | jq -r '.deployedTo')

echo "DisasterPoolFactory deployed to: $FACTORY"

echo ""
echo "=== Deployment Summary ==="
echo "Network: $NETWORK"
echo "PlayerStats: $PLAYER_STATS"
echo "ReactionVerifier: $REACTION_VERIFIER"
echo "DisasterPoolFactory: $FACTORY"
echo "USDC Token: $USDC_ADDRESS"




