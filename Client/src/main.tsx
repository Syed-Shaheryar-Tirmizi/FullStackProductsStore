import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/layout/index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { routes } from './app/router/Routes.tsx';
import { StoreProvider } from './app/context/StoreContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <RouterProvider router={routes} />
    </StoreProvider>
  </StrictMode>,
)
