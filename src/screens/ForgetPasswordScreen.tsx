import { DoubleCheckIcon } from '@endeavorpal/assets'
import { BackgroundImage } from '@endeavorpal/components'
import { useDirection } from '@endeavorpal/hooks'
import { UserService } from '@endeavorpal/services'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

// TypeScript interface for the initial state
interface EmailState {
  email: string
  submitted: boolean
}

const ForgetPasswordScreen: React.FC = () => {
  const navigate = useNavigate()
  const { isRTL } = useDirection()
  const [emailState, setEmailState] = useState<EmailState>({ email: '', submitted: false })
  const [hovered, setHovered] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ email?: string }>({})

  const handleEmailChange = (email: string) => {
    setEmailState({ ...emailState, email })
  }

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  })

  const handleSubmit = async () => {
    try {
      await validateEmail(emailState.email)
      await UserService.requestPasswordReset(emailState.email)
      setEmailState({ ...emailState, submitted: true })
    } catch (error) {
      console.error('Error sending password reset email:', error)
    }
  }

  const validateEmail = async (email: string) => {
    try {
      await emailValidationSchema.validate({ email: email }, { abortEarly: false })
      const errors: { [key: string]: string } = {}
      setErrors(errors)
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: { [key: string]: string } = {} // Initialize errors as an empty object
        error.inner.forEach(({ path, message }) => {
          errors[path as string] = message // Cast path as string
        })
        setErrors(errors)
      } else {
        console.error('Error sending password reset email:', error)
      }
    }
  }

  const handleKeyPress = (event: NativeSyntheticEvent<TextInput>, submitForm: () => Promise<void>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submitForm()
    }
  }

  const handleBack = () => {
    navigate('/login')
  }

  if (emailState.submitted) {
    return (
      <View style={styles.container}>
        <BackgroundImage />
        <Text style={[styles.title, { alignItems: 'center', width: '100%' }]}>Forgot your password</Text>
        <View style={{ alignItems: 'center', width: '100%' }}>
          <DoubleCheckIcon width='50' />
        </View>
        <Text style={styles.description}>
          An email will be sent to the provided email address to reset the account if it exists within the system.
        </Text>
        <View style={styles.buttonContainer}>
          <Text
            style={[
              styles.prompt,
              { alignItems: 'flex-start' },
              isRTL && styles.textAlignRight,
              Platform.OS === 'web' && hovered ? styles.boldText : null,
            ]}
            onPress={handleBack}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Text style={styles.backLink}>Login</Text>
          </Text>
        </View>
      </View>
    )
  }

  return (
    <>
      <BackgroundImage />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Forgot your password</Text>
        <Text style={styles.description}>
          Just let us know your email address and we will email you a password reset link that will allow you to choose
          a new one.
        </Text>
        <TextInput
          id='email'
          name='email'
          style={styles.input}
          onChangeText={handleEmailChange}
          onBlur={async (event: NativeSyntheticEvent<TextInput>) => await validateEmail(event.target.value)}
          onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, handleSubmit)}
          value={emailState.email}
          placeholder='Your email address'
          autoCapitalize='none'
          autoCompleteType='email'
          autoCorrect={false}
          inputMode='email'
          textContentType='emailAddress'
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>

        <View style={styles.buttonContainer}>
          <Text
            style={[
              styles.prompt,
              { alignItems: 'flex-start' },
              isRTL && styles.textAlignRight,
              Platform.OS === 'web' && hovered ? styles.boldText : null,
            ]}
            onPress={handleBack}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Text style={styles.backLink}>Back</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 40,
    color: '#ffffff',
    backgroundColor: 'rgba(8, 37, 33, 0.8)', // #082521
    width: '100%',
    maxWidth: 420,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#ffffff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
    color: '#ffffff',
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        ':focus': {
          borderColor: 'darkorange',
        },
        ':focus-within': {
          borderColor: 'darkorange',
        },
        ':invalid': {
          borderColor: 'red',
        },
      },
    }),
  },
  errorText: {
    color: 'darkorange',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#08786b',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
  },
  prompt: {
    textAlign: 'left',
    marginTop: 10,
    color: 'white',
    width: '100%',
  },
  backLink: {
    color: 'darkorange',
    textDecorationLine: 'none',
    marginLeft: 10,
    ...Platform.select({
      web: {
        ':hover': {
          color: 'darkorange',
          fontWeight: 'bold',
        },
      },
    }),
  },
  textAlignRight: {
    textAlign: 'right',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  boldText: {
    fontWeight: 'bold',
  },
})

export default ForgetPasswordScreen
