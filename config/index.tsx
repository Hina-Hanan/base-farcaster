import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, base } from '@reown/appkit/networks'

// Get projectId from https://dashboard.reown.com
// Use a placeholder for build-time if not set (will be replaced at runtime)
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'placeholder-project-id'

// Warn in development if projectId is not set
if (process.env.NODE_ENV === 'development' && projectId === 'placeholder-project-id') {
  console.warn('⚠️ NEXT_PUBLIC_PROJECT_ID is not set. Wallet connection may not work properly.')
}

// Include Base so the app supports connecting on the Base network
export const networks = [base, mainnet, arbitrum]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig