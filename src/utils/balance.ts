import { BALANCE_DIVISOR } from '@/constants/common'
import { formatNumber } from '@/utils/number'

export function formatBalance (balance: number): string {
  return `${formatNumber(balance / BALANCE_DIVISOR, 3)} APT`
}
