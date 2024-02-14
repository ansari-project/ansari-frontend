import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

// Function component to use the useTranslation hook and export validation constants
const useRegisterSchema = () => {
  const { t } = useTranslation('register')

  const passwordStrength = (minLength: number, minUppercase: number, minNumbers: number, minSymbols: number) =>
    Yup.string()
      .required(t('passwordRequired'))
      .test('password-strength', 'Password does not meet requirements', (value = '') => {
        const errors = []
        // Check for minimum length
        if (value.length < minLength) {
          errors.push(`at least ${minLength} characters long`)
        }

        // Check for uppercase letters
        const uppercaseMatches = value.match(/[A-Z]/g) || []
        if (uppercaseMatches.length < minUppercase) {
          errors.push(`at least ${minUppercase} uppercase letter(s)`)
        }

        // Check for numbers
        const numberMatches = value.match(/[0-9]/g) || []
        if (numberMatches.length < minNumbers) {
          errors.push(`at least ${minNumbers} number(s)`)
        }

        // Check for symbols
        const symbolMatches = value.match(/[!@#$%^&*(),.?":{}|<>]/g) || []
        if (symbolMatches.length < minSymbols) {
          errors.push(`at least ${minSymbols} special character(s)`)
        }

        if (errors.length > 0) {
          return new Yup.ValidationError(`Password must contain \n${errors.join('\n')}.`, null, 'password')
        }

        // If no errors, return true
        return true
      })

  return {
    email: Yup.string().email(t('emailInvalid')).required(t('emailRequired')),
    // password: Yup.string().min(8, t('passwordLength')).required(t('passwordRequired')),
    password: passwordStrength(8, 1, 1, 1),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], t('confirmPasswordMatch'))
      .required(t('confirmPasswordRequired')),
    firstName: Yup.string().required(t('firstNameRequired')),
    lastName: Yup.string().required(t('lastNameRequired')),
  }
}

export default useRegisterSchema
