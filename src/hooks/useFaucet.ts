import { useState } from 'react'
import { Account } from '@/types/account'

import { useToast } from '@chakra-ui/react'

import useClient from './useClient'

function useFaucet () {
  const [batchLoading, setBatchLoading] = useState(false)
  const toast = useToast()
  const { faucetClient } = useClient()

  const batchFundAccounts = async (accounts: Account[], successCallback?: () => void, errorCallback?: () => void) => {
    const requests = accounts.map(async account => await faucetClient.fundAccount(account.address, 100000000))

    setBatchLoading(true)

    Promise.all(requests)
      .then(() => {
        toast({
          title: 'Fund Account.',
          description: 'Successfully funded with 1 APT coin!',
          status: 'success',
          duration: 3000,
          isClosable: true
        })

        successCallback?.()
      }).catch(err => {
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
        setBatchLoading(false)
      })
  }

  return {
    batchLoading,
    batchFundAccounts
  }
}

export default useFaucet
