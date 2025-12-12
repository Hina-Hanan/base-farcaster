# Deployment Guide

Complete guide for deploying Disaster Reflex Trainer to Base mainnet.

## Prerequisites

1. **Base RPC Access**
   - Get RPC URL from [Base Portal](https://portal.base.org) or use public RPC
   - Mainnet: `https://mainnet.base.org`
   - Sepolia: `https://sepolia.base.org`

2. **Wallet Setup**
   - Create a new wallet or use existing one
   - Fund with ETH for gas fees (at least 0.1 ETH recommended)
   - **NEVER share your private key**

3. **WalletConnect Project ID**
   - Sign up at [Reown Dashboard](https://dashboard.reown.com)
   - Create a new project
   - Copy Project ID

4. **BaseScan API Key** (optional, for verification)
   - Sign up at [BaseScan](https://basescan.org)
   - Get API key from account settings

## Step 1: Environment Setup

Create `.env` file in project root:

```env
# Base Network
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Deployment Wallet (NEVER commit!)
PRIVATE_KEY=0x...

# WalletConnect
NEXT_PUBLIC_PROJECT_ID=your_project_id

# App URL (update after frontend deployment)
NEXT_PUBLIC_URL=http://localhost:3000

# USDC on Base Mainnet
USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# BaseScan (optional)
BASESCAN_API_KEY=your_api_key
```

## Step 2: Install Dependencies

```bash
pnpm install
```

## Step 3: Compile Contracts

```bash
pnpm compile
```

Verify compilation succeeds without errors.

## Step 4: Test Contracts (Recommended)

```bash
pnpm test
```

All tests should pass before deploying to mainnet.

## Step 5: Deploy to Base Sepolia (Testnet)

**Always test on Sepolia first!**

```bash
pnpm deploy:baseSepolia
```

Expected output:
```
Deploying contracts with account: 0x...
Deploying PlayerStats...
PlayerStats deployed to: 0x...
Deploying ReactionVerifier...
ReactionVerifier deployed to: 0x...
Deploying DisasterPoolFactory...
DisasterPoolFactory deployed to: 0x...

=== Deployment Summary ===
Network: baseSepolia
PlayerStats: 0x...
ReactionVerifier: 0x...
DisasterPoolFactory: 0x...
USDC Token: 0x...
```

**Save these addresses!**

## Step 6: Test on Sepolia

1. Update `.env` with Sepolia contract addresses
2. Update `NEXT_PUBLIC_URL` to your test deployment
3. Test all functionality:
   - Wallet connection
   - Free play mode
   - Pool creation
   - Pool joining
   - Reaction submission
   - Pool closing

## Step 7: Deploy to Base Mainnet

**Only proceed if Sepolia tests pass!**

```bash
pnpm deploy:base
```

**Important:**
- Double-check you're deploying to mainnet
- Ensure wallet has sufficient ETH
- Save all contract addresses immediately

## Step 8: Verify Contracts (Optional)

Verify on BaseScan for transparency:

```bash
# PlayerStats
npx hardhat verify --network base <PLAYER_STATS_ADDRESS>

# ReactionVerifier
npx hardhat verify --network base <REACTION_VERIFIER_ADDRESS>

# DisasterPoolFactory
npx hardhat verify --network base <FACTORY_ADDRESS> <PLAYER_STATS_ADDRESS> <USDC_ADDRESS>
```

## Step 9: Update Environment Variables

Update `.env` with mainnet addresses:

```env
NEXT_PUBLIC_PLAYER_STATS_ADDRESS=0x...
NEXT_PUBLIC_DISASTER_POOL_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_REACTION_VERIFIER_ADDRESS=0x...
```

## Step 10: Deploy Frontend

### Option A: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Add environment variables in Vercel dashboard

### Option B: Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod`
4. Add environment variables in Netlify dashboard

### Option C: Other Hosting

1. Build: `pnpm build`
2. Export: `pnpm export` (if using static export)
3. Upload `out/` directory to your hosting provider
4. Set environment variables

## Step 11: Update App URL

Update `NEXT_PUBLIC_URL` in environment variables to your production URL:

```env
NEXT_PUBLIC_URL=https://your-domain.com
```

Redeploy frontend after updating.

## Step 12: Test Production Deployment

1. Visit your production URL
2. Connect wallet
3. Test free play mode
4. Create a test pool
5. Verify all functionality works

## Step 13: Create Initial Pool

After deployment, create an initial pool to bootstrap the game:

1. Go to Prize Pools page
2. Click "Create Pool"
3. Set entry fee (e.g., 10 USDC)
4. Set duration (e.g., 1 hour)
5. Approve and create

## Troubleshooting

### Contract Deployment Fails

- Check RPC URL is correct
- Ensure wallet has enough ETH
- Verify network is Base mainnet
- Check contract compilation succeeded

### Frontend Can't Connect to Contracts

- Verify contract addresses in `.env`
- Check network is Base mainnet
- Ensure RPC URL is accessible
- Check browser console for errors

### Transactions Fail

- Check wallet has enough ETH for gas
- Verify USDC approval if joining pools
- Check contract addresses are correct
- Ensure you're on correct network

### Frame Not Loading

- Verify `NEXT_PUBLIC_URL` is correct
- Check Frame metadata in `app/page.tsx`
- Ensure HTTPS is enabled (required for Farcaster)
- Test Frame URL directly

## Post-Deployment Checklist

- [ ] Contracts deployed to Base mainnet
- [ ] Contracts verified on BaseScan
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] Wallet connection works
- [ ] Free play mode functional
- [ ] Pool creation works
- [ ] Pool joining works
- [ ] Reaction submission works
- [ ] Leaderboard displays correctly
- [ ] Profile page works
- [ ] Frame loads in Farcaster

## Monitoring

Set up monitoring for:

1. **Contract Events**: Monitor `ReactionRecorded`, `PoolCreated`, `PoolClosed`
2. **Error Tracking**: Use Sentry or similar
3. **Analytics**: Track user engagement
4. **Gas Costs**: Monitor transaction costs

## Security Reminders

- ✅ Never commit `.env` file
- ✅ Use separate wallets for deployment
- ✅ Keep private keys secure
- ✅ Test thoroughly on Sepolia first
- ✅ Consider multi-sig for contract ownership
- ✅ Regular security audits recommended

## Support

If you encounter issues:

1. Check contract deployment logs
2. Review browser console errors
3. Verify environment variables
4. Test on Sepolia first
5. Check Base network status

---

**Happy deploying! 🚀**




