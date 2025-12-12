"use client";

import React, { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { projectId, wagmiAdapter } from "@/config";
import { APP_URL } from "@/lib/constants";

// Create a Query Client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Warn if projectId is placeholder (but don't throw to allow build)
if (projectId === 'placeholder-project-id') {
  console.warn("⚠️ NEXT_PUBLIC_PROJECT_ID is not set. Wallet connection may not work properly.");
}

// Suppress CSP and network errors in console (these are expected in Farcaster iframe)
if (typeof window !== 'undefined' && !(window as any).__cspErrorSuppressed) {
  (window as any).__cspErrorSuppressed = true;
  
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    // Suppress known CSP violations that we can't control in Farcaster iframe
    if (
      message.includes('Content Security Policy') ||
      message.includes('violates the following Content Security Policy') ||
      message.includes('explorer-api.walletconnect.com') ||
      (message.includes('Failed to fetch') && message.includes('walletconnect')) ||
      message.includes('ERR_NETWORK_CHANGED') ||
      message.includes('ERR_NAME_NOT_RESOLVED')
    ) {
      // Silently ignore these errors - they're expected in Farcaster iframe
      return;
    }
    originalError.apply(console, args);
  };

  // Suppress unhandled promise rejections for network errors
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.toString() || '';
    if (
      reason.includes('Failed to fetch') ||
      reason.includes('CSP') ||
      reason.includes('Content Security Policy') ||
      reason.includes('walletconnect') ||
      reason.includes('signal is aborted')
    ) {
      event.preventDefault();
    }
  });
}

// App metadata (required for AppKit modal)
const metadata = {
  name: "Farcaster Wallet Example",
  description: "Wallet provider for Farcaster MiniApp",
  url: APP_URL, // should match your deployed miniapp domain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Initialize Reown AppKit (browser wallet modal)
let appKitInitialized = false;
try {
  // @ts-expect-error - Known type mismatch between @reown/appkit versions, works at runtime
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [base],
    defaultNetwork: base,
    metadata,
    features: {
      analytics: false, // Disable analytics to reduce external requests
    },
    themeMode: 'light',
    themeVariables: {
      '--w3m-accent': '#2563eb',
    },
  });
  appKitInitialized = true;
  console.log("AppKit initialized successfully");
} catch (error) {
  console.warn("AppKit initialization warning (may be expected in Farcaster iframe):", error);
}

// Main Provider
export default function WalletProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies?: string | null;
}) {
  // Initialize Farcaster MiniApp + Wagmi from cookies (session persistence)
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies ?? undefined
  );

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
