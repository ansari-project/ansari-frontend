import React, { PropsWithChildren } from 'react'
import Header from './Header'
import Footer from './Footer'
import '../styles/appLayout.scss'

type AppLayoutProps = PropsWithChildren<{ children?: React.ReactNode }>

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className='app-content'>
        {children} {/* This is where your screen content will be rendered */}
      </main>
      <Footer />
    </>
  )
}

export default AppLayout
