import { StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native'
import { Theme } from './theme'

// Define a type for the styles object
type ThemedStyles = {
  input: ViewStyle
  smallButton: ViewStyle
  buttonPrimary: ViewStyle
  buttonPrimaryHover: ViewStyle
  buttonPrimaryText: TextStyle
  buttonPrimaryTextHover: TextStyle
  buttonSecondary: ViewStyle
  buttonSecondaryText: TextStyle
  buttonTextDisabled: TextStyle
  buttonDisabled: ViewStyle
  link: ViewStyle
  errorText: TextStyle
  textAlignRight: TextStyle
  textAlignLeft: TextStyle
  boldText: TextStyle
  boldUnderlineText: TextStyle
  prompt: TextStyle
  eyeIcon: ViewStyle
  formContainer: ViewStyle
  form: ViewStyle
  fullWidth: ViewStyle
}

// Define a factory function to generate styles with dynamic theme values
const createThemedStyles = (
  theme: Theme,
  isRTL: boolean,
  isSmallScreen: boolean,
  width: string | number = 320,
): ThemedStyles => {
  return StyleSheet.create({
    formContainer: {
      ...Platform.select({
        web: {
          flex: 1,
          position: 'relative',
          zIndex: 1,
          color: theme.primaryColor,
          width: isSmallScreen ? width : '100%',
          paddingHorizontal: 24,
          paddingVertical: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        default: {
          flex: 1,
          justifyContent: 'center',
          padding: 20,
          backgroundColor: theme.backgroundColor,
        },
      }),
    },
    form: {
      width: 380,
      marginVertical: 'auto',
      paddingHorizontal: isSmallScreen ? 24 : 'initial',
    },
    input: {
      paddingVertical: 18,
      paddingHorizontal: 24,
      marginVertical: 10,
      borderRadius: 4,
      fontSize: 16,
      lineHeight: 19,
      color: theme.textColor,
      backgroundColor: theme.inputBackgroundColor,
      placeholderTextColor: theme.inputColor,
      borderColor: theme.inputBorderColor,
      borderWidth: 1,
      textAlign: isRTL ? 'right' : 'left',
      fontWeight: '500',
      fontFamily: 'Inter',
    },
    smallButton: {
      paddingVertical: isSmallScreen ? 6 : 8,
      paddingHorizontal: 15,
    },
    buttonPrimaryHover: {},
    buttonPrimary: {
      cursor: 'pointer',
      backgroundColor: theme.buttonPrimaryBackground,
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 4,
      alignItems: 'center',
      marginVertical: isSmallScreen ? 6 : 12,
      marginHorizontal: 6,
    },
    buttonPrimaryTextHover: {},
    buttonPrimaryText: {
      color: theme.buttonPrimaryColor,
      fontWeight: 'bold',
      fontFamily: 'Inter',
    },
    buttonSecondary: {
      cursor: 'pointer',
      borderColor: theme.buttonSecondaryBorderColor,
      backgroundColor: theme.buttonSecondaryBackground,
      borderWidth: 1,
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 4,
      alignItems: 'center',
      marginVertical: isSmallScreen ? 6 : 12,
      marginHorizontal: 6,
    },
    buttonSecondaryText: {
      color: theme.buttonSecondaryColor,
      fontWeight: 'bold',
      fontFamily: 'Inter',
    },
    buttonTextDisabled: {
      color: theme.textColor,
    },
    buttonDisabled: {},
    errorText: {
      color: theme.errorColor,
      lineHeight: 21,
      marginBottom: 10,
      fontFamily: 'Inter',
    },
    link: {
      fontSize: 14,
      fontHeight: 17.5,
      color: theme.linkColor,
      textDecorationLine: 'none',
      marginLeft: isRTL ? 0 : 10,
      marginRight: isRTL ? 10 : 0,
      fontFamily: 'Inter',
    },
    textAlignRight: {
      textAlign: isRTL ? 'left' : 'right',
    },
    textAlignLeft: {
      textAlign: isRTL ? 'right' : 'left',
    },
    boldText: {
      fontWeight: 'bold',
      fontFamily: 'Inter',
    },
    boldUnderlineText: {
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      fontFamily: 'Inter',
    },
    prompt: {
      textAlign: isRTL ? 'left' : 'right',
      marginVertical: 10,
      color: theme.primaryColor,
      fontFamily: 'Inter',
    },
    eyeIcon: {
      position: 'absolute',
      right: isRTL ? 'auto' : 10,
      left: isRTL ? 10 : 'auto',
    },
    fullWidth: {
      width: '100%',
    },
  })
}

export default createThemedStyles
