import {
  Button,
  ButtonProps,
  useColorMode
} from '@chakra-ui/react'

import { FiSun, FiMoon } from 'react-icons/fi'

function ColorMode (props: ButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Button onClick={toggleColorMode} {...props}>
      {colorMode === 'light' ? <FiSun /> : <FiMoon />}
    </Button>
  )
}

export default ColorMode
