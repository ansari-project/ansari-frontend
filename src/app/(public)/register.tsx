import { EyeIcon, LogoIcon } from '@/components/svg'
import { useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, register } from '@/store'
import { RegisterRequest } from '@/types'
import { createGeneralThemedStyles } from '@/utils'
import { useRegisterSchema } from '@/validation'
import { Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, NativeSyntheticEvent, Platform, Pressable, Text, TextInput, View } from 'react-native'
import Checkbox from 'expo-checkbox'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import * as Yup from 'yup'
import StyledText from '@/components/StyledText'

interface RegisterFormValues {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  registerToMailList: boolean
}

const RegisterScreen: React.FC = () => {
  const { t } = useTranslation('register')
  const dispatch = useDispatch<AppDispatch>()
  const { isRTL } = useDirection()
  const router = useRouter()
  const registerSchema = useRegisterSchema()
  const { isSmallScreen, width } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [hovered, setHovered] = useState<boolean>(false)

  const initialValues: RegisterFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    registerToMailList: true,
  }

  const handleSubmit = (values: RegisterFormValues, formikHelpers: FormikHelpers<RegisterFormValues>) => {
    formikHelpers.setSubmitting(true)
    setErrorMessage(null)
    const registerRequest: RegisterRequest = {
      email: values.email,
      password: values.password,
      // eslint-disable-next-line camelcase
      first_name: values.firstName,
      // eslint-disable-next-line camelcase
      last_name: values.lastName,
      // eslint-disable-next-line camelcase
      register_to_mail_list: values.registerToMailList,
    }
    dispatch(register(registerRequest))
      .unwrap()
      .then((response) => {
        if (response.status === 'error') {
          setErrorMessage(response.message || t('registerFailure'))
        } else {
          router.push('/login?s=' + t('registerSuccess'))
        }
      })
      .catch((error) => {
        formikHelpers.setSubmitting(false)
        setErrorMessage(error.message || t('registerFailure'))
      })
      .finally(() => {
        formikHelpers.setSubmitting(false)
      })
  }

  const handleKeyPress = (event: NativeSyntheticEvent<TextInput>, submitForm: () => Promise<void>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submitForm()
    }
  }

  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)

  return (
    <KeyboardAvoidingView style={generalStyle.formContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={generalStyle.form}>
        <View className='items-center py-2'>
          <LogoIcon fill={theme.iconFill} width={52} height={52} />
        </View>
        <StyledText variant='h2' color='primary' className='mb-6'>
          {t('title')}
        </StyledText>
        <Formik
          initialValues={initialValues}
          validateOnChange={false}
          validationSchema={Yup.object(registerSchema)}
          onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            submitForm,
            touched,
            values,
            isSubmitting,
            errors,
            setFieldValue,
          }) => (
            <View>
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.email}
                placeholder={t('email')}
                placeholderTextColor={theme.inputColor}
                style={generalStyle.input}
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect={false}
                inputMode='email'
              />
              {touched.email && errors.email && <Text style={generalStyle.errorText}>{errors.email}</Text>}

              <TextInput
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.firstName}
                placeholder={t('firstName')}
                placeholderTextColor={theme.inputColor}
                style={generalStyle.input}
                autocomplete='off'
              />
              {touched.firstName && errors.firstName && <Text style={generalStyle.errorText}>{errors.firstName}</Text>}

              <TextInput
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.lastName}
                placeholder={t('lastName')}
                placeholderTextColor={theme.inputColor}
                style={generalStyle.input}
                autocomplete='off'
              />
              {touched.lastName && errors.lastName && <Text style={generalStyle.errorText}>{errors.lastName}</Text>}

              <View className='justify-center'>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                  value={values.password}
                  placeholder={t('password')}
                  placeholderTextColor={theme.inputColor}
                  secureTextEntry={!passwordVisible}
                  style={generalStyle.input}
                />
                <Pressable style={generalStyle.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                  <EyeIcon name={passwordVisible ? 'eye-slash' : 'eye'} height={16} width={16} stroke='gray' />
                </Pressable>
              </View>
              {touched.password && errors.password && <Text style={generalStyle.errorText}>{errors.password}</Text>}

              <View className='justify-center'>
                <TextInput
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                  value={values.confirmPassword}
                  placeholder={t('confirmPassword')}
                  placeholderTextColor={theme.inputColor}
                  secureTextEntry={!passwordVisible}
                  style={generalStyle.input}
                />
                <Pressable style={generalStyle.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                  <EyeIcon name={passwordVisible ? 'eye-slash' : 'eye'} height={16} width={16} stroke='gray' />
                </Pressable>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={generalStyle.errorText}>{errors.confirmPassword}</Text>
              )}

              <View className='flex-row items-center py-2'>
                <Checkbox
                  value={values.registerToMailList}
                  onValueChange={(value: boolean) => setFieldValue('registerToMailList', value)}
                  className={isRTL ? 'ml-2' : 'mr-2'}
                />
                <StyledText className='text-sm leading-4 font-light' color='text'>
                  {t('mailListText')}
                </StyledText>
              </View>
              {errors.registerToMailList && <Text style={generalStyle.errorText}>{errors.registerToMailList}</Text>}

              {errorMessage && <Text style={generalStyle.errorText}>{errorMessage}</Text>}

              <Pressable
                style={[generalStyle.buttonPrimary, isSubmitting && generalStyle.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={generalStyle.buttonPrimaryText}>{isSubmitting ? t('registering') : t('register')}</Text>
              </Pressable>

              <View
                className='flex-row justify-end'
                style={[generalStyle.prompt, Platform.OS === 'web' && hovered ? generalStyle.boldUnderlineText : null]}
              >
                <StyledText style={generalStyle.primaryColorText}>{t('alreadyHaveAccount')}</StyledText>
                <Pressable
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onPress={() => router.push('/login')}
                >
                  <StyledText style={generalStyle.link}>{t('loginHere')}</StyledText>
                </Pressable>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen
