import { TFunction } from 'i18next'
import { Platform } from 'react-native'

/**
 * Determines if a given value is considered "blank".
 *
 * A value is considered blank if meets any of the following:
 * - It is `null` or ``.
 * - It is a string that is empty contains only whitespace.
 * - It is an array with no elements.
 * - It is an object with no own enumerable properties.
 *
 * @param {string|number|boolean|null|undefined|Array<any>|Object} value - The value to check.
 * @returns {boolean} - `true` if the value is considered blank, otherwise `false`.
 */
const isBlank = (
  value: string | number | boolean | null | undefined | Array<unknown> | Record<string, unknown>,
): boolean => {
  // Check for null or undefined
  if (value === null || value === undefined) {
    return true
  }

  // Check for an empty string or a string that only contains whitespace
  if (typeof value === 'string' && value.trim().length === 0) {
    return true
  }

  // Check for an empty array
  if (Array.isArray(value) && value.length === 0) {
    return true
  }

  // Check for an object with no own enumerable properties
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true
  }

  // If none of the conditions above are met, the value is not blank
  return false
}

// Usage examples
// console.log(isBlank(null));           // Output: true
// console.log(isBlank(''));             // Output: true
// console.log(isBlank('  '));           // Output: true
// console.log(isBlank([]));             // Output: true
// console.log(isBlank({}));             // Output: true
// console.log(isBlank(0));              // Output: false
// console.log(isBlank(false));          // Output: false

/**
 * Enhances the unique identifier string generation to include at least one uppercase letter,
 * one number, and one special character when special characters are requested.
 *
 * This function generates a random string of a specified length that is composed of uppercase and lowercase letters,
 * digits, and optionally, special characters. When special characters are included (controlled by the `special` flag),
 * the function now ensures the string contains at least one uppercase letter, one digit, and one special character,
 * making the output more suitable for secure identifiers such as passwords or tokens.
 *
 * Note: While this function aims to generate strings suitable for a variety of non-cryptographic needs,
 * it does not produce cryptographically secure strings. For scenarios requiring higher security, such as
 * generating secure tokens or passwords, consider using platform-specific cryptographic functions.
 *
 * @param length {number} - The desired length of the unique identifier. Defaults to 32 characters.
 * @param special {boolean} - Whether to include special characters in the identifier. Defaults to false.
 * @returns {string} - The generated unique identifier string, meeting the specified character inclusion criteria.
 */
const generateUniqueId = (length: number = 32, special: boolean = false): string => {
  let result = ''
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const allCharacters = letters + letters.toUpperCase() + numbers
  const specialCharacters = '!@#$%^&*(){}|<>?'

  // Ensure the inclusion of at least one uppercase letter, one number, and one special character if special is true
  if (special && length >= 3) {
    // Ensure minimum length to accommodate the requirements
    result += letters.charAt(Math.floor(Math.random() * letters.length)).toUpperCase() // Add uppercase letter
    result += numbers.charAt(Math.floor(Math.random() * numbers.length)) // Add number
    result += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length)) // Add special character

    // Fill the rest of the string with a mix of all characters to meet the total requested length
    for (let i = result.length; i < length; i++) {
      result += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length))
    }

    // Shuffle the result to distribute the guaranteed characters randomly throughout the string
    result = result
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('')
  } else {
    // If not including special characters, or if length is less than 3, fall back to original behavior
    for (let i = 0; i < length; i++) {
      result += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length))
    }
  }

  return result
}

/**
 * Generates random email and password credentials for guest accounts.
 *
 * This function is designed to create credentials for guest accounts in applications where users
 * can perform actions without creating a permanent account. It leverages the `generateUniqueId` function
 * to ensure that each set of credentials is unique. The email address generated follows a specific format,
 * incorporating a unique identifier to avoid collisions, and is assigned a domain specific to the application
 * (e.g., @endeavorpal.com). The password is also uniquely generated, including special characters to enhance
 * security, making it suitable for temporary access without compromising system integrity.
 *
 * The generated email follows a pattern using "guest_" as a prefix, ensuring easy identification of guest accounts.
 * The password is crafted to include a minimum number of special characters, aligning with common security practices
 * for password complexity.
 *
 * @returns An object containing the generated email and password for a guest account. The email is constructed
 * with a unique identifier and a predefined domain, while the password is generated to include alphanumeric
 * and special characters, ensuring both uniqueness and a degree of security suitable for guest access.
 */
const generateGuestCredentials = (): { email: string; password: string } => {
  // Generate a unique identifier for the email, ensuring guest email addresses are unique
  const email = `guest_${generateUniqueId(10)}@ansari.chat`

  // Generate a secure password with a specified length, including special characters for added security
  const password = generateUniqueId(12, true)

  return { email, password }
}

/**
 * Generates a localized, human-readable string representing a date range or a specific date,
 * suitable for displaying as a header in lists such as threads, grouped by date categories.
 * It supports internationalization by utilizing the `t` function from `i18next` for translating
 * predefined date categories into localized strings.
 *
 * @param {string} dateCategory - A predefined key representing a specific date range or category.
 *    Acceptable values include 'today', 'yesterday', 'lastWeek', 'lastMonth', or other custom
 *    keys as defined in your localization files.
 * @param {Date} threadDate - An optional Date object, used for categories like 'older' to generate
 *    a more specific month and year string. It's ignored for predefined categories such as 'today'.
 * @param {TFunction} t - The translation function provided by `i18next`, used to convert date
 *    category keys into localized strings. It enables the support for multiple languages in the UI.
 * @returns {string} A descriptive and localized header string that indicates the time period of
 *    the threads being listed. This could be 'Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days',
 *    or a custom formatted string representing the month and year for 'older' threads.
 */
const createLocalizedDateHeader = (dateCategory: string, threadDate: Date, t: TFunction): string => {
  switch (dateCategory) {
    case 'today':
      return t('today')
    case 'yesterday':
      return t('yesterday')
    case 'lastWeek':
      return t('previous7Days')
    case 'lastMonth':
      return t('previous30Days')
    default:
      // For 'older', returns a formatted string representing the month and year.
      return threadDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      })
  }
}

/**
 * Validates a UUID string.
 * @param uuid The UUID string to validate.
 * @returns true if the UUID string is valid, otherwise false.
 */
function isValidateUUID(uuid: string): boolean {
  // Regular expression to match UUID format
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  // Test if the UUID string matches the regex pattern
  return uuidRegex.test(uuid)
}

function isMobileWithAddressBar(): boolean {
  if (Platform.OS !== 'web') return false

  const isAddressBarVisible = window.innerHeight < window.screen.height
  return isAddressBarVisible
}

export default {
  isBlank,
  isValidateUUID,
  generateUniqueId,
  generateGuestCredentials,
  createLocalizedDateHeader,
  isMobileWithAddressBar,
}
