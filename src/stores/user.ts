import create from 'zustand'

import { devtools, persist } from 'zustand/middleware'

import { Account } from '@/types/account'

interface UserState {
  accounts: Account[]
  addAccount: (account: Account) => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        accounts: [],
        addAccount: (account: Account) =>
          set((state) => ({ accounts: [...state.accounts, account] }))
      }),
      {
        name: 'aptos-account-storage'
      }
    )
  )
)
