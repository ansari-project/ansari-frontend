import { createBrowserHistory } from 'history'
import { createMemoryRouter } from 'react-router'
import { BrowserRouter as Router, Route, RouterProvider, Routes } from 'react-router-dom'
import store from '../../store/store'
import sharedRoutes from './sharedRoutes'
import { AppLayout } from '../../components'

import { connectRouter, routerMiddleware } from 'connected-react-router'

const webHistory = createBrowserHistory()

const WebRoutes = () => {
  return (
    <Router history={webHistory}>
      <Routes>
        {sharedRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={<AppLayout>{route.element}</AppLayout>} />
        ))}
      </Routes>
    </Router>
  )
}

const nativeRouter = createMemoryRouter(sharedRoutes)
const syncHistory = routerMiddleware(nativeRouter)
const storeWithRouter = connectRouter(syncHistory, store)

const NativeRoutes = () => {
  return <RouterProvider router={storeWithRouter} history={syncHistory} />
}
export default { WebRoutes, NativeRoutes }
