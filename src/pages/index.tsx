import {
  VStack,
  Heading,
  Link,
  Text,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react'

import { FiCheckCircle } from 'react-icons/fi'

export default function Index () {
  return (
    <VStack spacing={10} p={10} alignItems='flex-start' bg='AppWorkspace'>
      <Heading size='2xl'>Aptos Web Faucet</Heading>
      <VStack spacing={4} w='full' alignItems='flex-start'>
        <Text fontSize='lg'>
          Powered by
        </Text>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={FiCheckCircle} color='teal.500' />
            <Link color='teal.500' href='https://reactjs.org/'>
              React
            </Link>
            <Text mx={2} display='inline-block'>+</Text>
            <Link color='teal.500' href='https://vitejs.dev/'>
              Vite
            </Link>
            <Text mx={2} display='inline-block'>+</Text>
            <Link color='teal.500' href='https://chakra-ui.com/'>
              Chakra UI
            </Link>
            <Text mx={2} display='inline-block'>+</Text>
            <Link color='teal.500' href='https://github.com/pmndrs/zustand/'>
              Zustand
            </Link>
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheckCircle} color='teal.500' />
            <Link color='teal.500' href='https://aptoslabs.com/'>
              Aptos Labs
            </Link>
          </ListItem>
        </List>
      </VStack>
    </VStack>
  )
}
