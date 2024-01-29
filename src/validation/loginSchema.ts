import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

// Function component to use the useTranslation hook and export validation constants
const useLoginSchema = () => {
  const { t } = useTranslation('login')

  return {
    email: Yup.string().email(t('emailInvalid')).required(t('emailRequiredField')),
    password: Yup.string().min(8, t('passwordLength')).required(t('passwordRequiredField')),
  }
}

export default useLoginSchema
