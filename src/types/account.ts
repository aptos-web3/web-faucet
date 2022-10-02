import { Network } from './network'
export interface FundAccountModel {
  address: string
  amount: string | number
}

export interface Account {
  network: Network
  address: string
  publicKeyHex: string
  privateKeyHex?: string
  authKey?: string
  balance: number
  loading?: boolean
}

export type AccountResult = Record<string, string> & { sequence_number: string }
