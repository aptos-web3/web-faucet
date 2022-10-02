import { ReactNode, ReactText } from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  chakra
} from '@chakra-ui/react'
import { FiHome, FiUser, FiCompass, FiCoffee, FiSettings, FiMenu } from 'react-icons/fi'

import { IconType } from 'react-icons'
import { ReactComponent as Logo } from '@/assets/icons/logo.svg'

import { useLocation } from 'react-router-dom'

import NetworkOptions from './NetworkOptions'
import ColorMode from './ColorMode'

interface LinkItemProps {
  name: string
  icon: IconType
  to: string
}
const LinkItems: LinkItemProps[] = [
  { name: 'Home', icon: FiHome, to: '/' },
  { name: 'Create Account', icon: FiUser, to: '/create-account' },
  { name: 'Faucet', icon: FiCoffee, to: '/faucet' },
  { name: 'Batch Faucet', icon: FiCompass, to: '/batch-faucet' },
  { name: 'Settings', icon: FiSettings, to: '/settings' }
]

function LogoComponent () {
  return (
    <Box maxW={{ base: '120px', md: '200px' }}>
      <Logo />
    </Box>
  )
}

export default function SimpleSidebar ({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box minH='100vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <chakra.header
        transition='box-shadow 0.2s, background-color 0.2s'
        pos='sticky'
        top='0'
        right='0'
        zIndex='3'
        bg='white'
        _dark={{ bg: 'gray.800' }}
        ml={{ base: 0, md: 60 }}
        p={4}
        display={{ base: 'none', md: 'flex' }}
        justifyContent='flex-end'
      >
        <NetworkOptions />
        <ColorMode ml={4} />
      </chakra.header>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen}>
        <NetworkOptions />
        <ColorMode />
      </MobileNav>
      <Box ml={{ base: 0, md: 60 }} p='4'>
        {children}
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <LogoComponent />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} to={link.to}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children: ReactText
  to: string
}
const NavItem = ({ icon, to, children, ...rest }: NavItemProps) => {
  const { pathname } = useLocation()

  return (
    <Link href={to} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align='center'
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        bg={pathname === to ? 'teal' : 'none'}
        color={pathname === to ? 'white' : 'none'}
        _hover={{
          bg: 'teal',
          color: 'white'
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr='4'
            fontSize='16'
            _groupHover={{
              color: 'white'
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void
  children: ReactNode
}
const MobileNav = ({ onOpen, children, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height='20'
      alignItems='center'
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent='space-between'
      {...rest}
    >
      <Flex>
        <IconButton
          variant='outline'
          onClick={onOpen}
          aria-label='open menu'
          icon={<FiMenu />}
          mr={4}
        />
        <LogoComponent />
      </Flex>
      {children}
    </Flex>
  )
}
