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

export default {
  isBlank,
}
