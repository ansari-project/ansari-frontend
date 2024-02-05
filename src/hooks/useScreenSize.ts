import { useWindowDimensions } from 'react-native'

/**
 * Custom hook for determining screen size categories based on width.
 *
 * Utilizes the `useWindowDimensions` hook from React Native to dynamically
 * fetch the window's dimensions and categorize the screen size. This can be
 * useful for responsive design within React Native applications, allowing
 * components to adjust their layout or functionality based on the current
 * screen size.
 *
 * @returns {object} An object containing two boolean properties:
 * - `isSmallScreen`: True if the screen width is less than 1024 pixels.
 * - `isMobile`: True if the screen width is less than 768 pixels.
 *
 * @example
 * const { isSmallScreen, isMobile } = useScreenSize();
 *
 * if (isMobile) {
 *   // Adjust layout for mobile
 * } else if (isSmallScreen) {
 *   // Adjust layout for small screens
 * } else {
 *   // Adjust layout for larger screens
 * }
 */
export const useScreenSize = () => {
  const { width } = useWindowDimensions()
  const isSmallScreen = width < 1024
  const isMobile = width <= 768

  return { isSmallScreen, isMobile, width }
}
