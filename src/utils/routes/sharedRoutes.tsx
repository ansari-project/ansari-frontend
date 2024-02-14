import { RouteObject } from 'react-router'
import { ChatScreen, HomeScreen, LoginScreen, RegisterScreen } from '../../screens'

const sharedRoutes: RouteObject[] = [
  { path: '/', element: <HomeScreen /> },
  { path: '/login', element: <LoginScreen /> },
  { path: '/register', element: <RegisterScreen /> },
  { path: '/chat/:threadId', element: <ChatScreen /> },
  // Add more routes here
]

export default sharedRoutes
