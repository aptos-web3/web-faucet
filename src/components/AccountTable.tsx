import { Box, Flex, Text, Spinner } from '@chakra-ui/react'

import { formatBalance } from '@/utils/balance'
import { Account } from '@/types/account'

import CopyButton from './CopyButton'

export interface AccountTableProps {
  accounts: Account[]
}

function AccountTable ({ accounts }: AccountTableProps) {
  return (
    <>
      <Flex maxW='full' p={1} borderBottomColor='gray.300' borderBottomWidth={1}>
        <Box w='40%' p={2}>
          <Text>Address</Text>
        </Box>
        <Box w='40%' p={2}>
          <Text>Public Key</Text>
        </Box>
        <Box w='20%' p={2}>
          <Text>Balance</Text>
        </Box>
      </Flex>
      {accounts.map((account, index) => (
        <Flex maxW='full' color='white' p={1} key={index} borderBottomColor='gray.300' borderBottomWidth={1}>
          <Box w='40%' p={2}>
            <Flex>
              <Text noOfLines={1} color='blue.400'>
                {account.address}
              </Text>
              <CopyButton text={account.address} toastTitle='Address' height='24px' />
            </Flex>
          </Box>
          <Box w='40%' p={2}>
            <Flex>
              <Text noOfLines={1} color='orange.400'>
                {account.publicKeyHex}
              </Text>
              <CopyButton text={account.publicKeyHex} toastTitle='PublicKey' height='24px' />
            </Flex>
          </Box>
          <Box w='20%' p={2} color='yellow.500'>
            {account.balance > 0
              ? (<Text noOfLines={1}>{formatBalance(account.balance)}</Text>)
              : (<Spinner />)
            }
          </Box>
        </Flex>
      ))}
    </>
  )
}

export default AccountTable
