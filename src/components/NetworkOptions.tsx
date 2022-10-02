import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button
} from '@chakra-ui/react'

import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

import { Network } from '@/types/network'
import { useSettingStore } from '@/stores/setting'

const networks: Network[] = ['devnet', 'testnet']

function NetworkOptions () {
  const network = useSettingStore((state) => state.network)

  return (
    <Menu >
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            rightIcon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
          >
            {network}
          </MenuButton>
          <MenuList>
            <MenuOptionGroup defaultValue={network} type='radio'>
              {networks.map((item) => (
                <MenuItemOption
                  key={item}
                  value={item}
                  color={ item === network ? 'teal.500' : '' }
                  onClick={() => useSettingStore.setState({ network: item })}
                >
                  {item}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  )
}

export default NetworkOptions
