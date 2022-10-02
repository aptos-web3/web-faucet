import { VStack, Button, Box, Tooltip, Text } from '@chakra-ui/react'

import { useUserStore } from '@/stores/user'
import useBalance from '@/hooks/useBalance'
import useFaucet from '@/hooks/useFaucet'
import { Account } from '@/types/account'

import Content from '@/components/Content'
import AccountTable from '@/components/AccountTable'
import RateLimitAlert from '@/components/RateLimitAlert'

const tip = 'You don\'t have any accounts yet, please create accounts first.'

export default function BatchFaucet () {
  const ACCOUNTS = useUserStore((state) => state.accounts)

  const { balance, refetch } = useBalance(ACCOUNTS.map((item) => item.address))
  const { batchLoading, batchFundAccounts } = useFaucet()

  const accounts: Account[] = ACCOUNTS.map((account) => {
    return {
      network: account.network,
      address: account.address,
      publicKeyHex: account.publicKeyHex,
      loading: true,
      balance: balance?.[account.address]
    }
  })

  const fund = (accounts: Account[]) => {
    batchFundAccounts(accounts, () => {
      refetch()
    }).finally(() => {})
  }

  return (
    <Content title='Batch Faucet'>
      <VStack spacing={4} w='full' alignItems='flex-start'>
        <Box p={0} margin={0} maxW='960px' w='full'>
          <RateLimitAlert />
          <AccountTable accounts={accounts} />

          {!accounts.length && (
            <Text textAlign='center' w='full' p={8}>
              {tip}
            </Text>
          )}

          <Tooltip hasArrow label={accounts.length ? '' : tip}>
            <Button
              onClick={() => fund(accounts)}
              isLoading={batchLoading}
              disabled={!accounts.length}
              colorScheme='pink'
              mt={4}
            >
              Batch Faucet
            </Button>
          </Tooltip>
        </Box>
      </VStack>
    </Content>
  )
}
