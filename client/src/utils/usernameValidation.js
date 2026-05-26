const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/
const MIN_LENGTH = 3
const MAX_LENGTH = 20
const STORAGE_KEY = 'uno_username'

export const validateUsername = (username) => {
  const trimmed = username.trim()

  if (!trimmed) {
    return { valid: false, error: 'Username is required' }
  }

  if (trimmed.length < MIN_LENGTH) {
    return { valid: false, error: `Username must be at least ${MIN_LENGTH} characters` }
  }

  if (trimmed.length > MAX_LENGTH) {
    return { valid: false, error: `Username must be at most ${MAX_LENGTH} characters` }
  }

  if (!USERNAME_REGEX.test(trimmed)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' }
  }

  return { valid: true, error: null }
}

export const saveUsernameToStorage = (username) => {
  try {
    localStorage.setItem(STORAGE_KEY, username)
  } catch (error) {
    console.error('Failed to save username to localStorage:', error)
  }
}

export const getStoredUsername = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to get username from localStorage:', error)
    return null
  }
}

export const clearStoredUsername = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear username from localStorage:', error)
  }
}
