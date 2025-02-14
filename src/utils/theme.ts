const background = '/images/background.png'
// Define the interface for the theme object
export interface Theme {
  primaryColor: string
  backgroundColor: string
  backgroundImage: string
  textColor: string
  iconFill: string
  inputBackgroundColor: string
  inputColor: string
  inputBorderColor: string
  buttonPrimaryBackground: string
  buttonPrimaryColor: string
  buttonPrimaryBorderColor: string
  buttonSecondaryBackground: string
  buttonSecondaryColor: string
  buttonSecondaryBorderColor: string
  linkColor: string
  errorColor: string
  sideMenuBackgroundColor: string
  popupBackgroundColor: string
  promptBackgroundHoverColor: string
  hoverColor: string
  logoColor: string
  messageBackgroundColor: string
  splashBackgroundColor: string
  sendIconColor: string
  backgroundColorSecondary: string
  scrollColor: string
  yellowColor: string
}

// Define the light theme object
export const lightTheme: Theme = {
  primaryColor: '#231414',
  backgroundColor: '#FFFFFF',
  backgroundImage: background,
  textColor: '#231414',
  iconFill: '#08786B',
  inputBackgroundColor: 'transparent',
  inputColor: '#D9D9D9',
  inputBorderColor: '#D9D9D9',
  buttonPrimaryBackground: '#08786b',
  buttonPrimaryColor: '#FFFFFF',
  buttonPrimaryBorderColor: 'transparent',
  buttonSecondaryBackground: '#657786',
  buttonSecondaryColor: '#FFFFFF',
  buttonSecondaryBorderColor: '#231414',
  hoverColor: '#17B5A2',
  linkColor: '#17B5A2',
  errorColor: '#17B5A2',
  sideMenuBackgroundColor: '#082521',
  popupBackgroundColor: '#F2F2F280',
  logoColor: '#D5D5D4',
  messageBackgroundColor: '#f2f9ff',
  promptBackgroundHoverColor: 'transparent',
  splashBackgroundColor: '#0000001A',
  sendIconColor: '#09786b',
  backgroundColorSecondary: '#1D1D1D66',
  scrollColor: '#D9D9E3CC',
  yellowColor: '#F29B00',
}

// Define the dark theme object
export const darkTheme: Theme = {
  primaryColor: '#D0D0D0',
  backgroundColor: '#0F0F0F',
  backgroundColorSecondary: '#1D1D1D66',
  backgroundImage: background,
  textColor: '#FFFFFF',
  iconFill: '#FFFFFF',
  inputBackgroundColor: '#4B4A4A',
  inputColor: '#7B838B',
  inputBorderColor: 'transparent',
  buttonPrimaryBackground: '#17B5A2',
  buttonPrimaryColor: '#FFFFFF',
  buttonPrimaryBorderColor: 'transparent',
  buttonSecondaryBackground: 'transparent',
  buttonSecondaryColor: '#C2C8D0',
  buttonSecondaryBorderColor: '#C2C8D0',
  linkColor: '#17B5A2',
  hoverColor: '#17B5A2',
  errorColor: '#FF6E6E',
  sideMenuBackgroundColor: '#1D1D1D',
  popupBackgroundColor: '#4B4A4A',
  logoColor: '#D5D5D4',
  promptBackgroundHoverColor: 'transparent',
  messageBackgroundColor: 'transparent',
  splashBackgroundColor: '#00000066',
  sendIconColor: '#302E2D',
  scrollColor: '#D9D9E3CC',
  yellowColor: '#F29B00',
}
