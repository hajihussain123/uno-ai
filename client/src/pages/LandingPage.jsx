import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/userStore'
import Input from '../components/Input'
import Button from '../components/Button'
import { validateUsername } from '../utils/usernameValidation'

export default function LandingPage() {
  const navigate = useNavigate()
  const username = useUserStore((state) => state.username)
  const isInitialized = useUserStore((state) => state.isInitialized)
  const setUsername = useUserStore((state) => state.setUsername)

  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(null)

  // Initialize from storage on mount
  useEffect(() => {
    useUserStore.getState().initializeFromStorage()
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && username) {
      navigate('/home', { replace: true })
    }
  }, [isInitialized, username, navigate])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    setError(null)
  }

  const handleContinue = () => {
    const validation = validateUsername(inputValue)

    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setUsername(inputValue.trim())
    navigate('/home', { replace: true })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleContinue()
    }
  }

  if (!isInitialized) {
    return <div className="min-h-screen bg-slate-900" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            UNO AI
          </h1>
          <p className="text-lg text-gray-300">Multiplayer Card Game</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter Your Username</h2>

          <div className="space-y-6">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter username (3-20 characters)"
              error={error}
              maxLength={20}
              autoFocus
            />

            <div className="text-sm text-gray-400 space-y-1">
              <p>• 3-20 characters</p>
              <p>• Letters, numbers, and underscores only</p>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!inputValue.trim()}
              variant="primary"
              size="lg"
              fullWidth
            >
              Continue
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 mt-8 text-sm">
          A fun multiplayer card game experience
        </p>
      </div>
    </div>
  )
}
