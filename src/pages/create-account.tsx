import { useState } from 'react'
import {
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  Text,
  FormControl,
  FormLabel,
  Button,
  ButtonGroup,
  Input
} from '@chakra-ui/react'

import { Account } from '@/utils/account'
import useFaucet from '@/hooks/useFaucet'
import { useUserStore } from '@/stores/user'
import { useSettingStore } from '@/stores/setting'

import Content from '@/components/Content'
import CopyButton from '@/components/CopyButton'

export default function CreateAccount () {
  const userStore = useUserStore()
  const settingStore = useSettingStore()

  const { loading, fundAccount } = useFaucet()
  const [successful, setSuccessful] = useState(false)
  const [account, setAccount] = useState({
    address: '',
    authKey: '',
    publicKeyHex: '',
    privateKeyHex: ''
  })
  function create () {
    const newAccount = new Account()

    const address = newAccount.address()
    const authKey = newAccount.authKey()
    const publicKeyHex = newAccount.publicKeyHex()
    const privateKeyHex = newAccount.privateKeyHex()

    fundAccount({ address, amount: 100000000 }, () => {
      const accountData = {
        network: settingStore.network,
        address,
        authKey,
        publicKeyHex,
        privateKeyHex,
        balance: 100000000
      }

      setAccount(accountData)

      userStore.addAccount(accountData)
      setSuccessful(true)
    })
  }

  return (
    <Content title='Create Account'>
      <VStack spacing={4} w='full' alignItems='flex-start'>
        <Alert status='info'>
          <AlertIcon />
          <AlertDescription>
          Account will be created on the
          <Text display='inline' px={1} color='blue.500' fontWeight='bold'>{ settingStore.network }</Text>
          network after the successful of faucet.
          </AlertDescription>
        </Alert>
        <FormControl>
          <FormLabel>Address</FormLabel>
          <Input value={account.address} readOnly={true} />
        </FormControl>
        <FormControl>
          <FormLabel>Auth Key</FormLabel>
          <Input value={account.authKey} readOnly={true} />
        </FormControl>
        <FormControl>
          <FormLabel>Public Key</FormLabel>
          <Input value={account.publicKeyHex} readOnly={true} />
        </FormControl>
        <FormControl>
          <FormLabel>Private Key</FormLabel>
          <Input value={account.privateKeyHex} readOnly={true} />
        </FormControl>
        <ButtonGroup>
          <Button onClick={create} colorScheme='pink' isLoading={loading}>
            Create
          </Button>
          <CopyButton
            size='lg'
            disabled={!successful}
            text={JSON.stringify(account)}
            toastTitle='Account'
          >
            Copy Account
          </CopyButton>
        </ButtonGroup>
      </VStack>
    </Content>
  )
}
