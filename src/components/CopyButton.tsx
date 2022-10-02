import { Button, ButtonProps, useClipboard, useToast } from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'

interface CopyButtonProps extends ButtonProps {
  text: string
  toastTitle: string
}

function CopyButton ({ text, toastTitle, ...props }: CopyButtonProps) {
  const { onCopy } = useClipboard(text)
  const toast = useToast()

  function handleCopy (text: string) {
    onCopy()
    toast({
      title: `${toastTitle} copied.`,
      description: text,
      status: 'success',
      duration: 1000,
      isClosable: true
    })
  }

  return (
    <Button
      colorScheme='teal'
      fontSize='md'
      height='40px'
      {...props}
      onClick={() => handleCopy(text)}
    >
      { props.children }
      <CopyIcon />
    </Button>
  )
}

export default CopyButton
