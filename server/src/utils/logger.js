export const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] INFO: ${message}`)
  },

  error: (message, error) => {
    const timestamp = new Date().toISOString()
    if (error) {
      console.error(`[${timestamp}] ERROR: ${message}`, error)
    } else {
      console.error(`[${timestamp}] ERROR: ${message}`)
    }
  },

  warn: (message) => {
    const timestamp = new Date().toISOString()
    console.warn(`[${timestamp}] WARN: ${message}`)
  },

  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString()
      console.log(`[${timestamp}] DEBUG: ${message}`)
    }
  },
}
