import { setupServer } from 'msw/node'
import { handlers } from './handlers'


// This configures a request interception server with the given request handlers.
// Setup MSW for Node.js environment (testing)
export const server = setupServer(...handlers)
