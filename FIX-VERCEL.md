# QUICK FIX FOR VERCEL DEPLOYMENT

## Run these commands NOW:

```bash
# 1. Go to project directory
cd c:\Users\hinah\basee\base-farcaster-1

# 2. Force add all lib files
git add -f lib/game/disasterScenarios.ts
git add -f lib/game/reactionTimer.ts  
git add -f lib/contracts/abis.ts
git add -f lib/contracts/addresses.ts
git add -f lib/constants.ts
git add -f lib/kv.ts
git add -f lib/notifs.ts

# 3. Verify they're added
git status

# 4. Commit
git commit -m "Add missing lib files for Vercel build"

# 5. Push to GitHub
git push origin main
```

## After pushing:

1. Go to Vercel Dashboard
2. Your deployment should auto-redeploy
3. Build should succeed!
