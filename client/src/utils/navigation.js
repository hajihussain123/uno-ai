import { useNavigate } from 'react-router-dom'

export const useNavigation = () => {
  const navigate = useNavigate()

  return {
    goToLanding: () => navigate('/', { replace: true }),
    goToHome: () => navigate('/home', { replace: true }),
    goToLobby: (roomCode) => navigate(`/lobby/${roomCode}`, { replace: true }),
    goToGame: (roomCode) => navigate(`/game/${roomCode}`, { replace: true }),
  }
}
