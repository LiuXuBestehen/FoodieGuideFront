import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import RouterView from './routes/useRoutes'



createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <BrowserRouter>
      <RouterView />
    </BrowserRouter>
  </ChakraProvider>,
)
