import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'

import { useSettingStore } from '@/stores/setting'
import { FundAccountModel, AccountResult } from '@/types/account'

import useClient from './useClient'
import { useBalance } from './useBalance'

function useAccount (address: string) {
  const toast = useToast()
  const { restClient, faucetClient } = useClient()
  const store = useSettingStore()

  const { balance, refetch } = useBalance(address, true)

  const [account, setAccount] = useState<AccountResult>()
  const [loading, setLoading] = useState(false)

  const getAccount = async (address: string) => {
    try {
      setLoading(true)
      const accountData = await restClient.account(address)
      setAccount(accountData)

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

  const fundAccount = (model: FundAccountModel, successCallback?: () => void, errorCallback?: () => void) => {
    setLoading(true)
    faucetClient.fundAccount(model.address, Number(model.amount))
      .then(async () => {
        toast({
          title: 'Created Account.',
          description: `Successfully created account ${model.address}.The account is funded with 1 APT coin!`,
          status: 'success',
          duration: 3000,
          isClosable: true
        })

        refetch()
        successCallback?.()
      })
      .catch(err => {
        errorCallback?.()

        toast({
          title: 'Faucet Error.',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      })
      .finally(() => {
        setLoading(false)
      })
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
    getAccount,
    fundAccount
  }
}

export default useAccount
