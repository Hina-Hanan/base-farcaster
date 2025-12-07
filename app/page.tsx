import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'
import LandingPage from '@/components/pages/landing'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/base.png`,
  button: {
    title: 'Play Disaster Reflex Trainer',
    action: {
      type: 'launch_frame',
      name: 'Disaster Reflex Trainer',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: '#1e3a8a',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(APP_URL),
    title: 'Disaster Reflex Trainer - Farcaster Frame Game',
    description: 'Test your reflexes in disaster scenarios. Free play or join prize pools on Base!',
    openGraph: {
      title: 'Disaster Reflex Trainer',
      description: 'Test your reflexes in disaster scenarios. Free play or join prize pools on Base!',
      images: [`${APP_URL}/images/splash.png`],
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <LandingPage />
}
