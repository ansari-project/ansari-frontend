import { useTranslation } from 'react-i18next'

/**
 * This hook returns whether the current language direction is Right-To-Left (RTL) or not.
 * It uses the `i18n.dir()` method from `react-i18next` to determine the direction.
 *
 * @returns An object containing the `isRTL` property, which is a boolean indicating whether the direction is RTL or not.
 */
export const useDirection = () => {
  // Get the `i18n` instance from the `useTranslation` hook
  const { i18n } = useTranslation()

  // Determine if the direction is RTL by comparing `i18n.dir()` to 'rtl'
  const isRTL = i18n.dir() === 'rtl'

  // Return an object containing the `isRTL` property
  return {
    isRTL,
  }
}
