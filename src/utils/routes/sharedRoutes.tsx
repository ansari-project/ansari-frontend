import {
  ChatScreen,
  ForgetPasswordScreen,
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  WelcomeScreen,
} from '@endeavorpal/screens'
import { RouteObject } from 'react-router'

/**
 * An array of route objects representing the shared routes in the application.
 * Each route object contains a path and an element component.
 *
 * @type {RouteObject[]}
 */
const sharedRoutes: RouteObject[] = [
  { path: '/', element: <HomeScreen /> },
  { path: '/welcome', element: <WelcomeScreen /> },
  { path: '/login', element: <LoginScreen /> },
  { path: '/forgot-password', element: <ForgetPasswordScreen /> },
  { path: '/reset-password', element: <ResetPasswordScreen /> },
  { path: '/register', element: <RegisterScreen /> },
  { path: '/chat/:threadId', element: <ChatScreen /> },
  { path: '*', element: <HomeScreen /> },
  // Add more routes here
]

export default sharedRoutes
