import {
  Alert,
  AlertIcon,
  AlertDescription,
  Text
} from '@chakra-ui/react'

import { useSettingStore } from '@/stores/setting'

import { Network } from '@/types/network'

const RATE_LIMIT: Record<Network, string> = {
  devnet: '10 per hour',
  testnet: '10 per day'
}

function RateLimitAlert () {
  const { network } = useSettingStore()

  return (
    <Alert status='warning'>
      <AlertIcon />
      <AlertDescription>
        The rate limit of the <Text display='inline' px={1} color='blue.500' fontWeight='bold'>{ network }</Text> network is {RATE_LIMIT[network]}.
      </AlertDescription>
    </Alert>
  )
}

export default RateLimitAlert
