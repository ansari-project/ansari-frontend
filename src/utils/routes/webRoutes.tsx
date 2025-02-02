import { AppLayout, PublicLayout, WelcomeLayout } from '@/components'
import { createBrowserHistory } from 'history'
import { RouteObject } from 'react-router'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import sharedRoutes from './sharedRoutes'

const webHistory = createBrowserHistory()

const renderLayoutForRoute = (route: RouteObject) => {
  switch (route.path) {
    case '/chat/:threadId':
    case '/':
    case '*':
      return <AppLayout>{route.element}</AppLayout>
    case '/welcome':
      return <WelcomeLayout>{route.element}</WelcomeLayout>
    default:
      return <PublicLayout>{route.element}</PublicLayout> // Render nothing if route path doesn't match
  }
}

const WebRoutes = () => {
  return (
    <Router history={webHistory}>
      <Routes>
        {sharedRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={renderLayoutForRoute(route)} />
        ))}
      </Routes>
    </Router>
  )
}

export default { WebRoutes }
