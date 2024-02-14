import { useWindowDimensions } from 'react-native'

const getAppContentPadding = (width: number, paddingHorizontal: number) => {
  const baseContentWidth = width - paddingHorizontal * 2
  const additionalPadding = baseContentWidth > 768 ? baseContentWidth - 768 : 0
  return paddingHorizontal + additionalPadding / 2
}

interface ScreenInfo {
  width: number // Full width of the screen
  height: number // Full height of the screen
  maxWidth: string // Maximum width for content based on screen size
  cpl: number // Target characters per line for readability
  paddingHorizontal: number // Horizontal padding to center content within screen
  actualPaddingHorizontal: number // Horizontal padding to center content within screen and ensure it's 768px max
  contentWidth: number // Actual width available for content, accounting for padding
  desiredWidth: number // Calculated width based on CPL and average character width of the Roboto font
  isLargeScreen: boolean // Indicates if the screen is larger than 1024px
  isMediumScreen: boolean // Indicates if the screen is between 768px and 1024px
  isSmallScreen: boolean // Indicates if the screen is smaller than 768px
}

export const useScreenInfo = (): ScreenInfo => {
  const { width, height } = useWindowDimensions()

  const isLargeScreen = width > 1024
  const isMediumScreen = width > 768 && width <= 1024
  const isSmallScreen = width <= 768

  const maxWidth = isLargeScreen ? '960px' : isMediumScreen ? '768px' : '100%'
  const cpl = isLargeScreen ? 75 : isMediumScreen ? 60 : 50
  const basePaddingHorizontal = isSmallScreen ? 20 : (width - (isLargeScreen ? 960 : 768)) / 2
  const paddingHorizontal = Math.max(basePaddingHorizontal, 20)
  const contentWidth = isSmallScreen ? width - 2 * paddingHorizontal : isLargeScreen ? 960 : 768
  const actualPaddingHorizontal = getAppContentPadding(width, paddingHorizontal)

  // Assuming an average character width (ACW) for the Roboto font at the desired font size
  const averageCharWidthPx = 9 // Example value in pixels
  const desiredWidth = cpl * averageCharWidthPx

  return {
    width,
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
  }
}
