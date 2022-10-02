import { VStack, Text, FormControl, FormLabel } from '@chakra-ui/react'

import { useSettingStore } from '@/stores/setting'

import Content from '@/components/Content'
import NetworkOptions from '@/components/NetworkOptions'

export default function Faucet () {
  const store = useSettingStore()
  const { TESTNET_URL, FAUCET_URL } = store.getEndpoint()

  return (
    <Content title='Settings'>
      <VStack spacing={4} w="full" alignItems="flex-start" maxW={800}>
        <FormControl>
          <FormLabel>Network</FormLabel>
          <NetworkOptions />
        </FormControl>
        <FormControl>
          <FormLabel>Restful URL</FormLabel>
          <Text color='teal.500'>{TESTNET_URL}</Text>
        </FormControl>
        <FormControl>
          <FormLabel>Faucet URL</FormLabel>
          <Text color='teal.500'>{FAUCET_URL}</Text>
        </FormControl>
      </VStack>
    </Content>
  )
}
