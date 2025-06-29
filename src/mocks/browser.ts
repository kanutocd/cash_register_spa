import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
// Setup MSW for browser environment (development)
export const worker = setupWorker(...handlers)

// Optional: Start the worker automatically in development
if (import.meta.env.MODE === 'development' && import.meta.env.VITE_MOCK === 'true') {
  worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    serviceWorker: {
      url: '/mockServiceWorker.js', // Default MSW service worker location
    },
  }).then(() => {
    console.log('🔧 MSW: Mock API is running in development mode')
  }).catch((error) => {
    console.error('❌ MSW: Failed to start service worker:', error)
  })
}
