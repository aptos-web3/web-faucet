import { ReactNode } from 'react'
import { VStack, Heading, Box } from '@chakra-ui/react'

export interface ContentProps {
  title: string
  children: ReactNode
}

function Content (props: ContentProps) {
  return (
    <VStack spacing={10} p={10} alignItems='flex-start' bg='AppWorkspace'>
      <Heading size='2xl'>{props.title}</Heading>
      <VStack spacing={4} w='full' alignItems='flex-start'>
        <Box p={0} margin={0} maxW='960px' w='full'>
          {props.children}
        </Box>
      </VStack>
    </VStack>
  )
}

export default Content
