import { useState } from 'react'
import { FundAccountModel, Account } from '@/types/account'

import { useToast } from '@chakra-ui/react'

import useClient from './useClient'

function useFaucet () {
  const [loading, setLoading] = useState(false)
  const [batchLoading, setBatchLoading] = useState(false)
  const toast = useToast()
  const { faucetClient } = useClient()

  const fundAccount = (model: FundAccountModel, successCallback?: () => void, errorCallback?: () => void) => {
    setLoading(true)
    faucetClient.fundAccount(model.address, Number(model.amount))
      .then(() => {
        toast({
          title: 'Created Account.',
          description: `Successfully created account ${model.address}.The account is funded with 1 APT coin!`,
          status: 'success',
          duration: 3000,
          isClosable: true
        })

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
    loading,
    fundAccount,
    batchLoading,
    batchFundAccounts
  }
}

export default useFaucet
