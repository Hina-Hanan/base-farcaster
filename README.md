# Disaster Reflex Trainer 🚨

A production-ready on-chain Farcaster Frame game deployed on Base mainnet. Test your reflexes in disaster scenarios - play for free or join prize pools to win USDC!

## Features

- 🎮 **Free Play Mode**: Practice your reflexes with random disaster scenarios
- 💰 **Prize Pool Mode**: Join pools by depositing USDC, fastest reaction wins
- 🏆 **Leaderboard**: Compete globally for the fastest reaction times
- 🥇 **Badge System**: Earn Gold, Silver, or Bronze badges based on reaction time
- 🔐 **On-Chain**: All stats and pools stored on Base blockchain
- 📱 **Farcaster Frame**: Native Farcaster integration

## Disaster Scenarios

1. **🌍 Earthquake** - Go under a table ✓ / Run to elevator ✗
2. **🔥 Fire** - Use stairs and go out ✓ / Use lift ✗ / Open window ✗
3. **🌊 Flood** - Go to higher ground ✓ / Walk through water ✗
4. **💨 Gas Leak** - Open windows and go outside ✓ / Switch on lights ✗ / Use matchstick ✗
5. **⚡ Lightning** - Stay inside ✓ / Stand under tree ✗

## Badge System

- **🥇 Gold**: < 300ms
- **🥈 Silver**: 300-600ms
- **🥉 Bronze**: 600-900ms
- **None**: > 900ms

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Hardhat, Base mainnet
- **Wallet**: Wagmi, viem, Reown AppKit, Farcaster MiniApp Connector
- **Frames**: Farcaster Frame API

## Smart Contracts

- `PlayerStats.sol` - Stores player statistics and badges
- `DisasterPool.sol` - Manages individual prize pools
- `DisasterPoolFactory.sol` - Factory for creating pools
- `ReactionVerifier.sol` - Verifies reaction time submissions

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Hardhat
- Base RPC URL
- WalletConnect Project ID ([get one here](https://dashboard.reown.com))

### Installation

```bash
# Install dependencies
pnpm install

# Install Hardhat dependencies
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox dotenv
```

### Environment Setup

Create a `.env` file:

```env
# Base Network RPC
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Private key for deployment (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# WalletConnect Project ID
NEXT_PUBLIC_PROJECT_ID=your_project_id_here

# App URL
NEXT_PUBLIC_URL=http://localhost:3000

# USDC Token Address on Base
USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# BaseScan API Key (for contract verification)
BASESCAN_API_KEY=your_basescan_api_key_here

# Contract addresses (set after deployment)
NEXT_PUBLIC_PLAYER_STATS_ADDRESS=
NEXT_PUBLIC_DISASTER_POOL_FACTORY_ADDRESS=
NEXT_PUBLIC_REACTION_VERIFIER_ADDRESS=
```

### Compile Contracts

```bash
pnpm compile
```

### Deploy Contracts

#### Using Hardhat

```bash
# Deploy to Base Sepolia (testnet)
pnpm deploy:baseSepolia

# Deploy to Base Mainnet
pnpm deploy:base
```

#### Using Foundry

```bash
# Make script executable
chmod +x scripts/deploy-foundry.sh

# Deploy to Base Sepolia
./scripts/deploy-foundry.sh baseSepolia

# Deploy to Base Mainnet
./scripts/deploy-foundry.sh base
```

After deployment, update your `.env` file with the contract addresses.

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
pnpm test
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── game/              # Free play game page
│   ├── pools/             # Prize pool pages
│   ├── leaderboard/       # Leaderboard page
│   └── profile/           # User profile page
├── components/            # React components
├── contracts/             # Solidity smart contracts
│   ├── PlayerStats.sol
│   ├── DisasterPool.sol
│   ├── DisasterPoolFactory.sol
│   └── ReactionVerifier.sol
├── hooks/                 # React hooks for contract interactions
├── lib/                   # Utility libraries
│   ├── contracts/        # Contract ABIs and addresses
│   └── game/             # Game logic (scenarios, timer)
├── scripts/               # Deployment scripts
└── test/                  # Contract tests
```

## Deployment

### Deploy to Base Mainnet

1. **Set up environment variables** in `.env`
2. **Compile contracts**: `pnpm compile`
3. **Deploy contracts**: `pnpm deploy:base`
4. **Update `.env`** with deployed contract addresses
5. **Deploy frontend** to Vercel/Netlify:
```bash
   vercel --prod
```
6. **Update `NEXT_PUBLIC_URL`** in environment variables to your production URL

### Verify Contracts on BaseScan

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Usage

### Free Play Mode

1. Connect your wallet
2. Click "Free Play"
3. Wait for random delay (1-3 seconds)
4. React quickly when "REACT NOW!" appears
5. Select the correct answer
6. View your reaction time and badge earned

### Prize Pool Mode

1. Connect your wallet
2. Go to "Prize Pools"
3. Select a pool or create a new one
4. Approve USDC spending
5. Join the pool
6. Wait for pool to start
7. Complete the reaction test
8. Fastest correct reaction wins the pool!

## Smart Contract Functions

### PlayerStats

- `registerPlayer()` - Register a new player
- `recordReaction(uint256 reactionTime, bool isWin)` - Record a reaction time
- `getPlayerData(address player)` - Get player statistics
- `getTopPlayers(uint256 limit)` - Get leaderboard

### DisasterPool

- `joinPool()` - Join a pool by depositing USDC
- `startPool()` - Start the pool (creator only)
- `submitReaction(uint256 reactionTime)` - Submit reaction time
- `closePool()` - Close pool and determine winner

### DisasterPoolFactory

- `createPool(uint256 entryFee, uint256 durationSeconds)` - Create a new pool
- `getActivePools(uint256 limit)` - Get list of active pools

## Security Considerations

- ⚠️ **Never commit private keys** to version control
- ✅ Use environment variables for sensitive data
- ✅ Test on Base Sepolia before mainnet deployment
- ✅ Consider contract audits for production use
- ✅ Implement rate limiting for API endpoints
- ✅ Validate all user inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [Wireframes documentation](./WIREFRAMES.md)
- Review contract tests in `/test`

## Acknowledgments

- Built for Base ecosystem
- Farcaster Frame integration
- Inspired by reaction time games

---

**Built with ❤️ on Base**
