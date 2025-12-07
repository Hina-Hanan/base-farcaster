# Disaster Reflex Trainer - Architecture Documentation

## Overview

Disaster Reflex Trainer is a production-ready on-chain Farcaster Frame game deployed on Base mainnet. The game combines reaction time testing with disaster preparedness education, featuring both free play and prize pool modes.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Farcaster Frame Layer                     │
│  (Frame metadata, launch_frame actions, user interactions)  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │  Game Pages  │  │   Profile   │      │
│  │    Page      │  │              │  │   Pages     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Hooks (wagmi/viem)                      │  │
│  │  - usePlayerStats                                     │  │
│  │  - useDisasterPool                                    │  │
│  │  - useRegisterPlayer                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Wallet Connection Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Wagmi      │  │  Reown       │  │  Farcaster   │      │
│  │   Config     │  │  AppKit      │  │  Connector   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Base Blockchain (Base Mainnet)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Smart Contracts                          │  │
│  │  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │ PlayerStats   │  │ DisasterPool │               │  │
│  │  │               │  │              │               │  │
│  │  │ - Player data │  │ - Pool state │               │  │
│  │  │ - Badges      │  │ - Participants│              │  │
│  │  │ - Leaderboard │  │ - Winner     │               │  │
│  │  └──────────────┘  └──────────────┘               │  │
│  │                                                      │  │
│  │  ┌──────────────┐  ┌──────────────┐               │  │
│  │  │ PoolFactory   │  │ Reaction     │               │  │
│  │  │               │  │ Verifier     │               │  │
│  │  │ - Create pools│  │ - Verify     │               │  │
│  │  │ - List pools  │  │   reactions  │               │  │
│  │  └──────────────┘  └──────────────┘               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              USDC Token (ERC20)                       │  │
│  │  - Entry fees                                         │  │
│  │  - Prize pools                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

### PlayerStats.sol

**Purpose**: Stores player statistics and badges on-chain

**Key Functions**:
- `registerPlayer()` - Register a new player
- `recordReaction(uint256 reactionTime, bool isWin)` - Record reaction time
- `getPlayerData(address)` - Get player statistics
- `getTopPlayers(uint256 limit)` - Get leaderboard

**Storage**:
- `mapping(address => PlayerData)` - Player data
- `address[]` - List of all players

**Events**:
- `PlayerRegistered(address)`
- `ReactionRecorded(address, uint256, BadgeLevel)`
- `BadgeEarned(address, BadgeLevel)`

### DisasterPool.sol

**Purpose**: Manages individual prize pools

**Key Functions**:
- `joinPool()` - Join pool by depositing USDC
- `startPool()` - Start the pool (creator only)
- `submitReaction(uint256)` - Submit reaction time
- `closePool()` - Close pool and determine winner

**State Variables**:
- `entryFee` - USDC amount required to join
- `participants` - Mapping of participants
- `winner` - Address of winner
- `isStarted` - Whether pool has started
- `isClosed` - Whether pool is closed

**Events**:
- `PoolStarted(uint256 poolId)`
- `ParticipantJoined(address, uint256)`
- `ReactionSubmitted(address, uint256, uint256)`
- `PoolClosed(address winner, uint256 reactionTime, uint256)`

### DisasterPoolFactory.sol

**Purpose**: Factory for creating and managing pools

**Key Functions**:
- `createPool(uint256 entryFee, uint256 duration)` - Create new pool
- `getPool(uint256 poolId)` - Get pool address
- `getActivePools(uint256 limit)` - Get active pools
- `getPlayerPools(address)` - Get pools created by player

**Storage**:
- `mapping(uint256 => address)` - Pool ID to address
- `mapping(address => uint256[])` - Player to pool IDs

### ReactionVerifier.sol

**Purpose**: Verify reaction time submissions using signatures

**Key Functions**:
- `verifyReaction(address, uint256, uint256, bytes32, bytes)` - Verify submission
- `isNonceUsed(bytes32)` - Check if nonce used

**Security**:
- Prevents replay attacks with nonces
- Timestamp validation (5 minute window)
- Signature verification

## Frontend Architecture

### Page Structure

```
app/
├── page.tsx              # Landing page with Frame metadata
├── game/
│   └── page.tsx         # Free play game
├── pools/
│   ├── page.tsx         # Pool list
│   ├── create/
│   │   └── page.tsx     # Create pool
│   └── [address]/
│       └── page.tsx    # Pool game page
├── leaderboard/
│   └── page.tsx         # Leaderboard
└── profile/
    └── page.tsx         # User profile
```

### Component Structure

```
components/
├── pages/
│   └── landing.tsx      # Landing page component
└── providers.tsx        # React providers (Wallet, Frame)
```

### Hook Structure

```
hooks/
├── usePlayerStats.ts    # Player stats hooks
└── useDisasterPool.ts   # Pool management hooks
```

### Library Structure

```
lib/
├── contracts/
│   ├── abis.ts          # Contract ABIs
│   └── addresses.ts    # Contract addresses
└── game/
    ├── disasterScenarios.ts  # Scenario definitions
    └── reactionTimer.ts      # Timer logic
```

## Data Flow

### Free Play Flow

1. User connects wallet
2. User clicks "Free Play"
3. Frontend calls `registerPlayer()` if needed
4. Game displays random scenario after delay
5. User selects answer
6. Frontend calculates reaction time
7. Frontend calls `recordReaction(reactionTime, false)`
8. Badge awarded if applicable
9. Stats updated on-chain

### Prize Pool Flow

1. User creates or joins pool
2. User approves USDC spending
3. User calls `joinPool()` (transfers USDC)
4. Pool creator calls `startPool()`
5. Game displays scenario after delay
6. User submits reaction via `submitReaction(reactionTime)`
7. Pool creator calls `closePool()` after duration
8. Winner receives prize (USDC transfer)
9. Stats updated with win

## Security Considerations

### On-Chain Security

1. **Access Control**: Only pool creator can start/close pool
2. **Reentrancy Protection**: Using checks-effects-interactions pattern
3. **Input Validation**: All inputs validated (reaction times, fees)
4. **Nonce System**: Prevents replay attacks in ReactionVerifier
5. **Timestamp Validation**: Prevents old submissions

### Frontend Security

1. **Wallet Connection**: Secure wallet connection via Wagmi
2. **Transaction Signing**: All transactions require user approval
3. **Input Validation**: Client-side validation before submission
4. **Error Handling**: Graceful error handling for failed transactions

## Performance Optimizations

1. **Contract Calls**: Batched reads where possible
2. **Caching**: React Query for contract data caching
3. **Lazy Loading**: Code splitting for pages
4. **Gas Optimization**: Efficient storage patterns in contracts

## Deployment Architecture

### Contract Deployment Order

1. PlayerStats (no dependencies)
2. ReactionVerifier (no dependencies)
3. DisasterPoolFactory (depends on PlayerStats, USDC)
4. DisasterPool (created via Factory)

### Frontend Deployment

1. Build Next.js app: `pnpm build`
2. Set environment variables
3. Deploy to Vercel/Netlify
4. Update Frame metadata with production URL

## Monitoring & Analytics

### On-Chain Events to Monitor

- `PlayerRegistered` - New player signups
- `ReactionRecorded` - Game completions
- `BadgeEarned` - Badge achievements
- `PoolCreated` - New pools
- `PoolClosed` - Pool completions

### Metrics to Track

- Total players
- Total games played
- Average reaction time
- Pool participation rate
- Prize pool volume

## Future Enhancements

1. **Multi-chain Support**: Deploy to other L2s
2. **NFT Badges**: Mint NFTs for badge achievements
3. **Tournaments**: Multi-round tournaments
4. **Social Features**: Share scores, challenges
5. **Mobile App**: Native mobile app
6. **Analytics Dashboard**: Admin dashboard for metrics

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity 0.8.20, Hardhat
- **Wallet**: Wagmi, viem, Reown AppKit
- **Network**: Base Mainnet
- **Token**: USDC (ERC20)
- **Frames**: Farcaster Frame API

---

**Last Updated**: 2024

