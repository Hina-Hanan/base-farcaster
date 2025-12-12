import { NextResponse } from "next/server";
import { APP_URL } from "@/lib/constants";

export async function GET() {
  const farcasterConfig = {
    frame: {
      version: "1",
      name: "Disaster Reflex Trainer",
      iconUrl: `${APP_URL}/images/base.png`,
      homeUrl: `${APP_URL}`,
      imageUrl: `${APP_URL}/images/splash.png`,
      screenshotUrls: [],
      tags: ["game", "farcaster", "miniapp", "base", "reaction"],
      primaryCategory: "games",
      buttonTitle: "Play Disaster Reflex Trainer",
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#1e3a8a",
      webhookUrl: `${APP_URL}/api/webhook`,
    },
  };

  return NextResponse.json(farcasterConfig);
}
