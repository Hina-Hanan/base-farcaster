import { NextRequest, NextResponse } from "next/server";
import { APP_URL } from "@/lib/constants";

/**
 * Farcaster Frame API endpoint
 * Handles frame interactions for the Disaster Reflex Trainer game
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const buttonIndex = searchParams.get("buttonIndex");
  const fid = searchParams.get("fid");

  // Default frame image
  const imageUrl = `${APP_URL}/images/splash.png`;

  // Frame HTML
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content='${JSON.stringify({
          version: "next",
          imageUrl,
          buttons: [
            {
              title: "🎮 Free Play",
              action: {
                type: "launch_frame",
                name: "Disaster Reflex Trainer",
                url: `${APP_URL}/game`,
              },
            },
            {
              title: "💰 Prize Pools",
              action: {
                type: "launch_frame",
                name: "Disaster Reflex Trainer",
                url: `${APP_URL}/pools`,
              },
            },
            {
              title: "🏆 Leaderboard",
              action: {
                type: "launch_frame",
                name: "Disaster Reflex Trainer",
                url: `${APP_URL}/leaderboard`,
              },
            },
          ],
        })}' />
        <meta property="og:image" content="${imageUrl}" />
        <title>Disaster Reflex Trainer</title>
      </head>
      <body>
        <h1>Disaster Reflex Trainer</h1>
        <p>Test your reflexes in disaster scenarios!</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buttonIndex, fid } = body;

    // Handle button clicks
    let redirectUrl = APP_URL;

    switch (buttonIndex) {
      case 1:
        redirectUrl = `${APP_URL}/game`;
        break;
      case 2:
        redirectUrl = `${APP_URL}/pools`;
        break;
      case 3:
        redirectUrl = `${APP_URL}/leaderboard`;
        break;
      default:
        redirectUrl = APP_URL;
    }

    return NextResponse.json({
      type: "frame",
      frame: {
        version: "next",
        imageUrl: `${APP_URL}/images/splash.png`,
        buttons: [
          {
            title: "🎮 Free Play",
            action: {
              type: "launch_frame",
              url: `${APP_URL}/game`,
            },
          },
          {
            title: "💰 Prize Pools",
            action: {
              type: "launch_frame",
              url: `${APP_URL}/pools`,
            },
          },
          {
            title: "🏆 Leaderboard",
            action: {
              type: "launch_frame",
              url: `${APP_URL}/leaderboard`,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Frame API error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

