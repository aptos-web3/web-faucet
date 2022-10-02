import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import { ChakraProvider, SkeletonText, Box } from '@chakra-ui/react'
import Layout from '@/components/Layout'

import './main.css'

import routes from '~react-pages'

const Fallback = () => {
  return (
    <Box padding='6' boxShadow='lg' bg='AppWorkspace'>
      <SkeletonText mt='4' noOfLines={20} spacing='4' />
    </Box>
  )
}

const App = () => {
  return (
    <Suspense fallback={<Fallback />}>
      {useRoutes(routes)}
    </Suspense>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  /**
   * when Strict Mode is on, you will see each component render twice rather than once
   * https://beta.reactjs.org/learn/you-might-not-need-an-effect
   */
  <React.StrictMode>
    <ChakraProvider>
      <Router>
        <Layout>
          <App />
        </Layout>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
)
