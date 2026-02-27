import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App' 
import { AuthProvider } from './contexts/AuthContext'
import { ProductProvider } from './contexts/ProductContext'
import './index.css'

export const createApp = ViteReactSSG(
  { 
    routes,
    // FIX: Change 'setup' to 'onRouterReady'
    onRouterReady(router) {
      router.afterEach(() => {
        // Ensure window exists for static build safety
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0);
        }
      });
    }
  },
  ({ app }) => {
    return (
        <AuthProvider>
          <ProductProvider>
            {app}
          </ProductProvider>
        </AuthProvider>
    )
  }
)