# 🚀 Complete Farcaster Mini App Deployment Guide

## ✅ Prerequisites Checklist

Before deploying, ensure:
- ✅ App is deployed and accessible on Vercel
- ✅ App previews correctly in Farcaster Preview Tool
- ✅ All images are accessible (icon, splash, screenshots)
- ✅ Webhook endpoint is working (`/api/webhook`)
- ✅ `.well-known/farcaster.json` endpoint is accessible

## Step 1: Verify Your Deployment

1. **Check your Vercel URL is live:**
   ```
   https://base-farcaster-alpha.vercel.app
   ```

2. **Verify manifest is accessible:**
   ```
   https://base-farcaster-alpha.vercel.app/.well-known/farcaster.json
   ```
   Should return JSON with your app details.

3. **Verify required images exist:**
   - Icon: `https://base-farcaster-alpha.vercel.app/images/base.png`
   - Splash: `https://base-farcaster-alpha.vercel.app/images/splash.png`
   - Feed image: `https://base-farcaster-alpha.vercel.app/images/splash.png`

## Step 2: Enable Developer Mode in Farcaster

1. **On Mobile (Farcaster App):**
   - Open Farcaster app
   - Go to **Settings** → **Developer** → **Domains**
   - Toggle on **Developer Mode**

2. **On Desktop:**
   - Visit: `https://farcaster.xyz/~/settings/developer-tools`
   - Toggle on **Developer Mode**

## Step 3: Generate Account Association

This associates your Mini App with your Farcaster account:

1. **In Farcaster Mobile App:**
   - Go to **Settings** → **Developer** → **Domains**
   - Enter your domain: `base-farcaster-alpha.vercel.app`
   - Click **Generate Domain Manifest**
   - Copy the generated `accountAssociation` object:
     ```json
     {
       "header": "...",
       "payload": "...",
       "signature": "..."
     }
     ```

2. **Update your manifest:**
   - Add the `accountAssociation` to `app/.well-known/farcaster.json/route.ts`
   - Commit and push to Vercel
   - Wait for deployment

## Step 4: Add Screenshots (Optional but Recommended)

Add screenshot URLs to showcase your app:

1. **Take screenshots** of your app (recommended: 2-4 screenshots)
2. **Upload them** to your Vercel deployment (e.g., `/public/images/screenshot1.png`)
3. **Update manifest** with `screenshotUrls` array

## Step 5: Submit Your Mini App

### Option A: Submit via Farcaster Mobile App

1. Open **Farcaster** app
2. Go to **Settings** → **Developer** → **Mini Apps**
3. Click **Submit Mini App** or **+** button
4. Enter your domain: `base-farcaster-alpha.vercel.app`
5. Farcaster will automatically fetch your manifest
6. Review the details
7. Click **Submit** or **Publish**

### Option B: Submit via Warpcast (Desktop)

1. Visit: `https://warpcast.com/~/developers/mini-apps`
2. Click **Submit Mini App**
3. Enter your domain: `base-farcaster-alpha.vercel.app`
4. Review and submit

## Step 6: Wait for Approval

- Farcaster team reviews your Mini App
- Usually takes 1-3 business days
- You'll receive notification when approved/rejected

## Step 7: Get Your Mini App Link

Once approved, your Mini App will be available at:

```
https://warpcast.com/~/miniapps/disaster-reflex-trainer
```

Or search for "Disaster Reflex Trainer" in Warpcast Mini Apps.

## 📋 Post-Deployment Checklist

- [ ] Manifest includes `accountAssociation`
- [ ] All images load correctly
- [ ] Webhook endpoint responds correctly
- [ ] App works in Farcaster Preview Tool
- [ ] Submitted via Farcaster Developer Tools
- [ ] Received approval notification
- [ ] Mini App appears in search

## 🔧 Troubleshooting

### "Manifest not found"
- Verify `.well-known/farcaster.json` is accessible
- Check Vercel deployment is live
- Ensure route is not blocked by middleware

### "Invalid accountAssociation"
- Regenerate in Farcaster app
- Ensure domain matches exactly
- Check signature is valid

### "Images not loading"
- Verify image URLs are absolute (https://)
- Check images exist in `/public/images/`
- Ensure CSP allows image sources

### "Webhook not working"
- Test webhook endpoint manually
- Check Redis/Upstash is configured
- Verify webhook URL in manifest

## 📚 Resources

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/docs)
- [Publishing Guide](https://miniapps.farcaster.xyz/docs/guides/publishing)
- [Developer Tools](https://farcaster.xyz/~/settings/developer-tools)

---

**Your App Details:**
- **Name:** Disaster Reflex Trainer
- **Domain:** base-farcaster-alpha.vercel.app
- **Category:** Games
- **Tags:** game, farcaster, miniapp, base, reaction

Good luck with your deployment! 🎮
