import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { Network } from '@/types/network'

export interface Endpoint {
  TESTNET_URL: string
  FAUCET_URL: string
}

export interface SettingState {
  network: Network
  getEndpoint: () => Endpoint
}

const endpoints: Record<Network, Endpoint> = {
  devnet: {
    TESTNET_URL: 'https://fullnode.devnet.aptoslabs.com',
    FAUCET_URL: 'https://faucet.devnet.aptoslabs.com'
  },
  testnet: {
    TESTNET_URL: 'https://testnet.aptoslabs.com',
    FAUCET_URL: 'https://faucet.testnet.aptoslabs.com'
  }
}

export const TESTNET_URL = 'https://testnet.aptoslabs.com'
export const FAUCET_URL = 'https://faucet.testnet.aptoslabs.com'

export const useSettingStore = create<SettingState>()(
  devtools(
    persist(
      (set, get) => ({
        network: 'devnet',
        setNetwork: (network: Network) => set((state) => ({ network })),
        getEndpoint: () => endpoints[get().network]
      }),
      {
        name: 'aptos-settings-storage'
      }
    )
  )
)
