import { Platform, useWindowDimensions } from 'react-native'

/**
 * Calculates the effective horizontal padding for the app content, ensuring that the content width does not exceed a maximum width.
 *
 * @param width The full width of the screen or viewport.
 * @param paddingHorizontal The base horizontal padding intended for the content.
 * @returns The adjusted horizontal padding that centers the content and respects the maximum content width.
 */
const getAppContentPadding = (width: number, paddingHorizontal: number): number => {
  const baseContentWidth = width - paddingHorizontal * 2
  const additionalPadding = baseContentWidth > 768 ? baseContentWidth - 768 : 0
  return paddingHorizontal + additionalPadding / 2
}

/**
 * Determines if the current environment should be considered mobile.
 *
 * This includes:
 * - Native environments (always considered mobile).
 * - Web environments with a mobile user agent.
 * - iPads in portrait mode.
 * - Desktop browsers with small screen sizes simulating mobile devices.
 *
 * @returns {boolean} True if the current environment is considered mobile, false otherwise.
 */
const isMobileDevice = (): boolean => {
  // Native environment: Always considered mobile.
  if (Platform.OS !== 'web') return true
  // Web environment: Determine based on user agent and screen dimensions.
  const userAgent = navigator.userAgent
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  // Define mobile user agent pattern and screen size threshold for considering a device as mobile.
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobileUA = mobileRegex.test(userAgent)
  const smallScreenThreshold = 768 // Pixels; adjust based on your criteria for "small screen"

  // Detect iPads specifically, considering screen dimensions for iPad identification.
  const isIpad = /iPad/i.test(userAgent) || (isMobileUA && screenWidth >= smallScreenThreshold)

  // iPad handling: Landscape mode is considered non-mobile, whereas portrait mode is mobile.
  if (isIpad) {
    return screenWidth <= screenHeight // True if portrait mode.
  }

  // Consider small screens on desktop as mobile.
  const isSmallScreen = screenWidth < smallScreenThreshold

  // For other devices, use the mobile user agent test result or small screen size.
  return isMobileUA || isSmallScreen
}

interface ScreenInfo {
  width: number // Full width of the screen
  height: number // Full height of the screen
  maxWidth: string // Maximum width for content based on screen size
  cpl: number // Target characters per line for readability
  paddingHorizontal: number // Horizontal padding to center content within screen
  actualPaddingHorizontal: number // Horizontal padding to center content within screen and ensure it's 768px max
  contentWidth: number // Actual width available for content, accounting for padding
  desiredWidth: number // Calculated width based on CPL and average character width of the Inter font
  isLargeScreen: boolean // Indicates if the screen is larger than 1024px
  isMediumScreen: boolean // Indicates if the screen is between 768px and 1024px
  isSmallScreen: boolean // Indicates if the screen is smaller than 768px
  isMobile: boolean // Indicates if we are running on mobile or small screen
  sideMenuDrawer: number // Width of the side menu drawer for mobile screen
}

/**
 * Custom hook to gather and compute various screen-related information, useful for responsive design.
 *
 * @returns An object containing detailed screen information and calculated values for optimal layout and typography.
 */

export const useScreenInfo = (sideMenuWidth: number = 0): ScreenInfo => {
  const { width, height } = useWindowDimensions()
  const isLargeScreen = width > 1024
  const isMediumScreen = width > 768 && width <= 1024
  const isSmallScreen = width <= 768
  const isMobile = isMobileDevice()

  const dynamicWidth = isMobile ? width : width - sideMenuWidth
  const maxWidth = isLargeScreen ? '960px' : isMediumScreen ? '768px' : '100%'
  const cpl = isLargeScreen ? 75 : isMediumScreen ? 60 : 50
  const basePaddingHorizontal = isSmallScreen ? 16 : (dynamicWidth - (isLargeScreen ? 960 : 768)) / 2
  const paddingHorizontal = Math.max(basePaddingHorizontal, 16)
  const actualPaddingHorizontal = getAppContentPadding(dynamicWidth, paddingHorizontal)
  const contentWidth =
    dynamicWidth > 920 ? 920 : dynamicWidth < width ? dynamicWidth : dynamicWidth - (isSmallScreen ? 16 : 32) // dynamicWidth - actualPaddingHorizontal * 2
  const sideMenuDrawer = dynamicWidth * 0.8
  // Assuming an average character width (ACW) for the Inter font at the desired font size
  const averageCharWidthPx = 9 // Example value in pixels
  const desiredWidth = cpl * averageCharWidthPx

  return {
    width: dynamicWidth,
    sideMenuDrawer,
    height,
    maxWidth,
    cpl,
    paddingHorizontal,
    actualPaddingHorizontal,
    contentWidth,
    desiredWidth,
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
    isMobile,
  }
}
