import { useLocation, useNavigate } from 'react-router-dom'

export const useTokenFromUrl = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get('token')
  if (!token) {
    const navigate = useNavigate()
    navigate('/login')
  }
  return token
}
