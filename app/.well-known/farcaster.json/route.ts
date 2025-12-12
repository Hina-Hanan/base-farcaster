import { NextResponse } from "next/server";
import { APP_URL } from "@/lib/constants";

export async function GET() {
  // Account Association - Required for publishing Mini App
  // Generate this in Farcaster app: Settings > Developer > Domains > Generate Domain Manifest
  // Then set NEXT_PUBLIC_FARCASTER_ACCOUNT_ASSOCIATION env var with JSON string
  const accountAssociation = process.env.NEXT_PUBLIC_FARCASTER_ACCOUNT_ASSOCIATION
    ? JSON.parse(process.env.NEXT_PUBLIC_FARCASTER_ACCOUNT_ASSOCIATION)
    : undefined;

  const farcasterConfig: {
    accountAssociation?: {
      header: string;
      payload: string;
      signature: string;
    };
    frame: {
      version: string;
      name: string;
      iconUrl: string;
      homeUrl: string;
      imageUrl: string;
      screenshotUrls: string[];
      tags: string[];
      primaryCategory: string;
      buttonTitle: string;
      splashImageUrl: string;
      splashBackgroundColor: string;
      webhookUrl: string;
      subtitle?: string;
      description?: string;
      tagline?: string;
      ogDescription?: string;
    };
  } = {
    ...(accountAssociation && { accountAssociation }),
    frame: {
      version: "1",
      name: "Disaster Reflex Trainer",
      iconUrl: `${APP_URL}/images/base.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/splash.png`,
      screenshotUrls: [], // Add screenshot URLs here: [`${APP_URL}/images/screenshot1.png`]
      tags: ["game", "reflex", "base", "reaction", "disaster"],
      primaryCategory: "games",
      buttonTitle: "Play Disaster Reflex Trainer",
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#1e3a8a",
      webhookUrl: `${APP_URL}/api/webhook`,
      subtitle: "Fastest fingers first",
      description: "Disaster Reflex Trainer is a Farcaster Mini App where players react fast to disasters. Earn badges for speed and compete in USDC prize pools, all tracked on-chain.",
      tagline: "disaster reflex trainer app",
      ogDescription: "Disaster Reflex Trainer is a Farcaster Mini App game on Base mainnet.",
    },
  };

  return NextResponse.json(farcasterConfig);
}
