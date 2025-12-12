# 🚀 Quick Farcaster Mini App Deployment Steps

## ✅ Your App is Ready!

Your app is already deployed at: **https://base-farcaster-alpha.vercel.app**

## Step-by-Step Deployment

### 1️⃣ Enable Developer Mode

**On Mobile (Farcaster App):**
- Open Farcaster app
- Go to **Settings** → **Developer** → Toggle **Developer Mode ON**

**On Desktop:**
- Visit: https://farcaster.xyz/~/settings/developer-tools
- Toggle **Developer Mode ON**

### 2️⃣ Generate Account Association

**In Farcaster Mobile App:**
1. Go to **Settings** → **Developer** → **Domains**
2. Enter your domain: `base-farcaster-alpha.vercel.app`
3. Click **Generate Domain Manifest**
4. Copy the generated JSON object (looks like this):
   ```json
   {
     "header": "your-header-value",
     "payload": "your-payload-value",
     "signature": "your-signature-value"
   }
   ```

### 3️⃣ Add Account Association to Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `NEXT_PUBLIC_FARCASTER_ACCOUNT_ASSOCIATION`
   - **Value:** Paste the JSON object you copied (as a single-line string)
   - **Environment:** Production (and Preview if needed)
3. **Redeploy** your app (Vercel will auto-redeploy or trigger manually)

### 4️⃣ Verify Manifest

Visit: https://base-farcaster-alpha.vercel.app/.well-known/farcaster.json

You should see `accountAssociation` in the JSON response.

### 5️⃣ Submit Your Mini App

**Option A - Mobile:**
1. Open **Farcaster** app
2. Go to **Settings** → **Developer** → **Mini Apps**
3. Click **Submit Mini App** or **+**
4. Enter: `base-farcaster-alpha.vercel.app`
5. Review and **Submit**

**Option B - Desktop:**
1. Visit: https://warpcast.com/~/developers/mini-apps
2. Click **Submit Mini App**
3. Enter: `base-farcaster-alpha.vercel.app`
4. Review and **Submit**

### 6️⃣ Wait for Approval

- Review usually takes **1-3 business days**
- You'll get a notification when approved

### 7️⃣ Get Your Mini App Link

Once approved, your Mini App will be available at:
- Search "Disaster Reflex Trainer" in Warpcast
- Or: `https://warpcast.com/~/miniapps/disaster-reflex-trainer`

---

## 🎯 Quick Checklist

- [ ] Developer Mode enabled
- [ ] Account Association generated
- [ ] Environment variable added to Vercel
- [ ] App redeployed
- [ ] Manifest verified (includes accountAssociation)
- [ ] Mini App submitted
- [ ] Approval received

---

## 📝 Notes

- **Account Association is REQUIRED** for publishing
- Without it, your Mini App won't be approved
- The manifest will work without it for testing, but not for publishing
- You can test your app in Preview Tool without accountAssociation

---

**Need help?** Check `FARCASTER_DEPLOYMENT_GUIDE.md` for detailed troubleshooting.
