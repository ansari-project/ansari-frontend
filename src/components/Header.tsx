// import React from 'react'
// import InfoPopup from './InfoPopup'
// import LanguageSelector from './LanguageSelector'

// const Header: React.FC = () => {
//   return (
//     <header className='app-header'>
//       <h1 style={{ color: '#082521', fontFamily: 'Lexend', fontWeight: '500', wordWrap: 'break-word' }}>ANSARI</h1>
//       <LanguageSelector />
//       <InfoPopup />
//       {/* Add other header elements like navigation links or icons */}
//     </header>
//   )
// }

// export default Header

import React from 'react'
import InfoPopup from './InfoPopup'
import LanguageSelector from './LanguageSelector'

const Header: React.FC = () => {
  return (
    <header className='app-header'>
      <div className='header-content'>
        <div></div>
        <h1 style={{ color: '#082521', fontFamily: 'Lexend', fontWeight: '500', wordWrap: 'break-word' }}>ANSARI</h1>
        <div className='right-content'>
          <LanguageSelector />
          <InfoPopup />
        </div>
      </div>
    </header>
  )
}

export default Header

// SCSS file
