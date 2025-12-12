# Quick Start Guide

Get Disaster Reflex Trainer up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Base wallet with some ETH for gas
- WalletConnect Project ID ([get one here](https://dashboard.reown.com))

## Step 1: Clone and Install

```bash
# Install dependencies
pnpm install
```

## Step 2: Set Up Environment

Create `.env` file:

```env
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_URL=http://localhost:3000
BASE_RPC_URL=https://mainnet.base.org
USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

## Step 3: Run Locally (Without Contracts)

For frontend-only testing:

```bash
pnpm dev
```

Visit `http://localhost:3000` and test the UI!

## Step 4: Deploy Contracts (Optional)

If you want to test with real contracts:

```bash
# Compile contracts
pnpm compile

# Deploy to Base Sepolia (testnet)
pnpm deploy:baseSepolia
```

After deployment, add contract addresses to `.env`:

```env
NEXT_PUBLIC_PLAYER_STATS_ADDRESS=0x...
NEXT_PUBLIC_DISASTER_POOL_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_REACTION_VERIFIER_ADDRESS=0x...
```

## Step 5: Test the Game

1. Open `http://localhost:3000`
2. Connect your wallet (via Warpcast or browser)
3. Click "Free Play" to test
4. Try creating a pool in "Prize Pools"

## Common Issues

### Wallet Not Connecting

- Make sure `NEXT_PUBLIC_PROJECT_ID` is set
- Check browser console for errors
- Try refreshing the page

### Contracts Not Found

- Verify contract addresses in `.env`
- Make sure you're on the correct network (Base)
- Check RPC URL is accessible

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- See [WIREFRAMES.md](./WIREFRAMES.md) for UI/UX details

## Need Help?

- Check the troubleshooting section in README.md
- Review contract tests in `/test`
- Check browser console for errors

---

**Happy coding! 🚀**



