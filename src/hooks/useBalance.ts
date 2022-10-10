import { useState, useEffect } from 'react'
import { formatBalance } from '@/utils/balance'

import useClient from './useClient'

export function useBalance (address: string, formatting?: boolean) {
  const { restClient } = useClient()

  const [balance, setBalance] = useState('')

  const fetchData = async () => {
    const result = await restClient.accountBalance(address)
    if (result === null) return 0

    return result
  }

  const refetch = () => {
    fetchData()
      .then((value) => {
        const formatted = formatBalance(value)
        setBalance(formatting ? formatted : value.toString())
      }).catch(console.error)
  }

  useEffect(() => {
    refetch()
  }, [])

  return {
    balance,
    refetch
  }
}

export function useBalances (addresses: string[]) {
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
