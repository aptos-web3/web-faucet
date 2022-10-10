import { useState, useEffect } from 'react'

import useClient from './useClient'

function useBalance (addresses: string[]) {
  const { restClient } = useClient()

  const initialState = addresses.reduce<Record<string, number>>((acc, address) => {
    acc[address] = 0
    return acc
  }, {})

  const [balance, setBalance] = useState(initialState)

  const fetchData = async () => {
    const requests = addresses.map(async (address) => {
      const result = await restClient.accountBalance(address)

      if (result === null) return 0

      return result
    })

    return await Promise.all(requests)
  }

  const refetch = () => {
    fetchData()
      .then((value) => {
        const newState = addresses.reduce<Record<string, number>>((acc, address, index) => {
          acc[address] = value[index]
          return acc
        }, {})

        setBalance(newState)
      }).catch(console.error)
  }

  useEffect(() => {
    refetch()
  }, [JSON.stringify(addresses)])

  return {
    balance,
    refetch
  }
}

export default useBalance
