import { useState, useMemo } from 'react'
import {
  VStack,
  FormControl,
  FormLabel,
  Button,
  Input
} from '@chakra-ui/react'
import { debounce } from 'lodash-es'

import useAccount from '@/hooks/useAccount'

import Content from '@/components/Content'
import RateLimitAlert from '@/components/RateLimitAlert'

export default function Faucet () {
  const [model, setModel] = useState({
    address: '0x5cea3975df78b0aa4415eb67f38bfa490d0777e89763d630f1db5f97d846f96f',
    amount: '100000000'
  })

  const { loading, balance, getAccount, fundAccount } = useAccount(model.address)

  const handleChangeAmount = (event: any) => {
    const value = event.target.value
    setModel({ ...model, amount: value })
  }

  const debouncedGetAccount = useMemo(() => debounce(getAccount, 500), [])

  const handleChangeAddress = (event: any) => {
    const value = event.target.value

    setModel({ ...model, address: value })
    debouncedGetAccount(value)?.finally(() => {})
  }

  return (
    <Content title='Faucet Account'>
      <VStack spacing={4} w='full' alignItems='flex-start'>
        <RateLimitAlert />
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Input placeholder='Enter Address' value={model.address} onChange={handleChangeAddress} />
        </FormControl>
        <FormControl>
          <FormLabel>Amount</FormLabel>
          <Input placeholder='Enter Amount' value={model.amount} onChange={handleChangeAmount} />
        </FormControl>
        <FormControl>
          <FormLabel>Balance</FormLabel>
          <Input disabled value={balance} variant='filled' />
        </FormControl>
        <Button
          onClick={() => fundAccount(model)}
          isLoading={loading}
          colorScheme='pink'
        >
          Faucet
        </Button>
      </VStack>
    </Content>
  )
}
