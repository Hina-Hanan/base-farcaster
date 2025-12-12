# 🔧 Vercel Environment Variable Setup

## ⚠️ Important: Only Paste the `accountAssociation` Part!

You should **ONLY** paste the `accountAssociation` object into Vercel, **NOT** the full JSON.

## Step-by-Step Instructions

### 1. Extract Only the `accountAssociation` Part

From your JSON, copy **ONLY** this part:

```json
{
  "header": "eyJmaWQiOjE1NTY3NTcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhGOTdiRjU2RTdiZTRDRUViNDI4OWY3ZmNkOWFBNjA4Nzg3MmQ0NjYyIn0",
  "payload": "eyJkb21haW4iOiJodHRwczovL2Jhc2UtZmFyY2FzdGVyLWFscGhhLnZlcmNlbC5hcHAifQ",
  "signature": "2bgOZVBP9Uv5R7+9/PuyhRpjJcxQlI3APwteBbXfjWpstv2We3ET9N1VgWwvi2/5Op8Kev015dIOyfnEblp5Uxs="
}
```

### 2. Convert to Single-Line String

Remove all line breaks and make it a single line:

```json
{"header":"eyJmaWQiOjE1NTY3NTcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhGOTdiRjU2RTdiZTRDRUViNDI4OWY3ZmNkOWFBNjA4Nzg3MmQ0NjYyIn0","payload":"eyJkb21haW4iOiJodHRwczovL2Jhc2UtZmFyY2FzdGVyLWFscGhhLnZlcmNlbC5hcHAifQ","signature":"2bgOZVBP9Uv5R7+9/PuyhRpjJcxQlI3APwteBbXfjWpstv2We3ET9N1VgWwvi2/5Op8Kev015dIOyfnEblp5Uxs="}
```

### 3. Add to Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Fill in:
   - **Key:** `NEXT_PUBLIC_FARCASTER_ACCOUNT_ASSOCIATION`
   - **Value:** Paste the single-line JSON string from step 2
   - **Environment:** Select **Production** (and **Preview** if you want)
4. Click **Save**
5. **Redeploy** your app (or wait for auto-redeploy)

### 4. Verify It Works

After redeployment, visit:
```
https://base-farcaster-alpha.vercel.app/.well-known/farcaster.json
```

You should see the full manifest with `accountAssociation` included.

## ❌ What NOT to Do

**DON'T paste the entire JSON** including the `frame` object. The `frame` part is already in your code and will be generated automatically.

**DON'T include the `frame` object** in the environment variable - only `accountAssociation`.

## ✅ What the Code Does

The code in `app/.well-known/farcaster.json/route.ts` will:
1. Read `NEXT_PUBLIC_FARCASTER_ACCOUNT_ASSOCIATION` from environment
2. Parse it as JSON
3. Combine it with the `frame` object (which is already in the code)
4. Return the complete manifest

## 🔍 Quick Check

After adding the env var and redeploying, your manifest should look like:

```json
{
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "..."
  },
  "frame": {
    "name": "Disaster Reflex Trainer",
    "version": "1",
    ...
  }
}
```

---

**Summary:** Only paste the `accountAssociation` object as a single-line JSON string into Vercel's environment variables.
