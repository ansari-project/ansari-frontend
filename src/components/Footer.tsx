// src/components/Footer.tsx

import React from 'react'
import Subscription from './Subscription'

const Footer: React.FC = () => {
  return (
    <footer className='app-footer'>
      <Subscription />
      {/* Add other footer elements like links or copyright notice */}
    </footer>
  )
}

export default Footer
