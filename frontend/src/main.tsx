import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, CircularProgress, Box } from '@mui/material'
import { ThemeProviderWrapper } from './components/ThemeProviderWrapper'
import './index.css'

const App = lazy(() => import('./App.tsx'))

const LoadingFallback = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    }}
  >
    <CircularProgress size={64} sx={{ color: 'primary.main' }} />
  </Box>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <CssBaseline />
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ThemeProviderWrapper>
  </StrictMode>,
)
