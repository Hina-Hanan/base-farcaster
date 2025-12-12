# PowerShell script to add lib files to git
Write-Host "Adding lib files to git..."

# Add all lib files
git add lib/game/disasterScenarios.ts
git add lib/game/reactionTimer.ts
git add lib/contracts/abis.ts
git add lib/contracts/addresses.ts
git add lib/constants.ts
git add lib/kv.ts
git add lib/notifs.ts
git add .gitignore

# Check status
Write-Host "`nGit status:"
git status --short

# Show what will be committed
Write-Host "`nFiles to be committed:"
git diff --cached --name-only

Write-Host "`nDone! Now run: git commit -m 'Add lib files' && git push"


