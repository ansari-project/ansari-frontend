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
 * Generates a unique identifier string.
 *
 * This function creates a random string of 32 characters composed of
 * uppercase and lowercase letters, as well as digits. It's useful for
 * generating unique keys for list items in React, unique session identifiers,
 * or any other scenario where a non-cryptographic random string is needed.
 *
 * Note: This method generates a non-cryptographically secure ID. For
 * scenarios requiring cryptographic security, consider using Web Crypto API
 * or Node's crypto module.
 *
 * @returns {string} A 32-character long unique identifier string.
 */
const generateUniqueId = (): string => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  // Loop 32 times to generate a string of 32 characters
  for (let i = 0; i < 32; i++) {
    // For each iteration, append a random character from the `characters` string
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export default {
  isBlank,
  generateUniqueId,
}
