import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'

import { formatBalance } from '@/utils/balance'
import { useSettingStore } from '@/stores/setting'
import { AccountResult } from '@/types/account'

import useClient from './useClient'

function useAccount (address?: string) {
  const toast = useToast()
  const { restClient } = useClient()
  const store = useSettingStore()

  const [account, setAccount] = useState<AccountResult>()
  const [balance, setBalance] = useState('')
  const [loading, setLoading] = useState(false)

  const getAccount = async (address: string) => {
    try {
      setLoading(true)
      const accountData = await restClient.account(address)
      const balanceData = await restClient.accountBalance(address)

      setAccount(accountData)
      setBalance(formatBalance(balanceData ?? 0))

      setLoading(false)
    } catch (err: any) {
      toast({
        title: 'Get Account Error.',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (address) {
      getAccount(address).finally(() => {})
    }
  }, [store.network])

  return {
    loading,
    account,
    balance,
    getAccount
  }
}

export default useAccount
