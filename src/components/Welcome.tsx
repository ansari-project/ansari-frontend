// import React from 'react'
// import { Trans, useTranslation } from 'react-i18next'
// import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
// import { useDispatch } from 'react-redux'
// import { AppDispatch } from 'store/store'
// import { FlagIcon, LanguageIcon } from '../assets'
// import { useScreenSize } from '../hooks'
// import { toggleInformationPopup } from '../store/slices/informationPopupSlice'
// import { GetEnv } from '../utils'

// const Welcome: React.FC = () => {
//   const { t, i18n } = useTranslation()
//   const { isSmallScreen, isMobile } = useScreenSize()

//   const dispatch = useDispatch<AppDispatch>()
//   const toggleInfoPopup = (openInfoPopup: boolean) => {
//     dispatch(toggleInformationPopup(openInfoPopup))
//   }

//   return (
//     <View style={[styles.container, { width: isSmallScreen ? '100%' : '80%' }]}>
//       <Text style={styles.text}>{t('gettingWrongSometimes')}</Text>
//       {!isMobile ? (
//         <>
//           <View style={styles.rowGap16}>
//             <FlagIcon />
//             <Pressable style={styles.text} onPress={() => Linking.openURL(GetEnv('FEEDBACK_MAIL_TO'))}>
//               <Text style={styles.text}>
//                 <Trans
//                   i18n={i18n}
//                   parent={Text}
//                   i18nKey='flaggingInstructions.desktop'
//                   components={{
//                     1: <Text style={{ textDecorationLine: 'underline', color: '#08786B' }} />,
//                   }}
//                   values={{ email: GetEnv('FEEDBACK_EMAIL') }}
//                 />
//               </Text>
//             </Pressable>
//           </View>
//           <View style={[styles.rowGap16]}>
//             <LanguageIcon />
//             <Text style={styles.text}>{t('multilingualMessage.desktop')}</Text>
//           </View>
//         </>
//       ) : (
//         <>
//           <View style={styles.rowGap16}>
//             <FlagIcon />
//             <Pressable style={styles.text} onPress={() => toggleInfoPopup(true)}>
//               <Text style={styles.text}>
//                 <Trans
//                   i18n={i18n}
//                   parent={Text}
//                   i18nKey='flaggingInstructions.mobile'
//                   components={{
//                     1: <Text style={{ textDecorationLine: 'underline', color: '#08786B' }} />,
//                   }}
//                 />
//               </Text>
//             </Pressable>
//           </View>
//           <View style={styles.rowGap16}>
//             <LanguageIcon />
//             <Pressable style={styles.text} onPress={() => toggleInfoPopup(true)}>
//               <Text style={styles.text}>
//                 <Trans
//                   i18n={i18n}
//                   parent={Text}
//                   i18nKey='multilingualMessage.mobile'
//                   components={{
//                     1: <Text style={{ textDecorationLine: 'underline', color: '#08786B' }} />,
//                   }}
//                 />
//               </Text>
//             </Pressable>
//           </View>
//         </>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     height: 'fit-content',
//     backgroundColor: 'white',
//     borderRadius: 0,
//     paddingTop: 20,
//     paddingBottom: 20,
//     paddingLeft: 20,
//     paddingRight: 10,
//     alignItems: 'flex-start',
//     gap: 16,
//   },
//   rowGap16: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     gap: 16,
//   },
//   text: {
//     fontSize: 16,
//     textAlign: 'left',
//     color: '#343434',
//     fontFamily: 'Roboto', // Make sure you have this font loaded on native
//     lineHeight: 24,
//     flexShrink: 1,
//   },
//   // Add more styles if needed
// })

// export default Welcome
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { FlagIcon, LanguageIcon } from '../assets' // Ensure these imports are correct
import { useDirection, useScreenInfo } from '../hooks'
import { toggleInformationPopup } from '../store/slices/informationPopupSlice'
import { GetEnv } from '../utils'

const Welcome: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { isRTL } = useDirection()
  const { isSmallScreen } = useScreenInfo()

  const dispatch = useDispatch()
  const toggleInfoPopup = (openInfoPopup: boolean) => {
    dispatch(toggleInformationPopup(openInfoPopup))
  }

  const textStyles = isRTL ? { marginRight: 16, textAlign: 'right' } : { marginLeft: 16, textAlign: 'left' }

  return (
    <View style={[styles.container, isSmallScreen ? styles.fullWidth : styles.reducedWidth]}>
      <Text style={styles.text}>{t('gettingWrongSometimes')}</Text>
      <View style={styles.iconRow}>
        <FlagIcon />
        <Pressable
          onPress={() => (isSmallScreen ? toggleInfoPopup(true) : Linking.openURL(GetEnv('FEEDBACK_MAIL_TO')))}
          style={{ flexShrink: 1 }}
        >
          <Text style={[styles.text, textStyles]}>
            <Trans
              i18n={i18n}
              parent={Text}
              i18nKey={isSmallScreen ? 'flaggingInstructions.mobile' : 'flaggingInstructions.desktop'}
              components={{
                1: <Text style={styles.linkText} />, // Adjust based on Trans component needs
              }}
              values={{ email: GetEnv('FEEDBACK_EMAIL') }}
            />
          </Text>
        </Pressable>
      </View>
      <View style={styles.iconRow}>
        <LanguageIcon />
        <Pressable onPress={() => toggleInfoPopup(true)} style={{ flexShrink: 1 }}>
          <Text style={[styles.text, textStyles]}>
            <Trans
              i18n={i18n}
              parent={Text}
              i18nKey={isSmallScreen ? 'multilingualMessage.mobile' : 'multilingualMessage.desktop'}
              components={{
                1: <Text style={styles.linkText} />, // Adjust based on Trans component needs
              }}
            />
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff80',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 10,
    alignItems: 'flex-start',
  },
  fullWidth: {
    width: '100%',
  },
  reducedWidth: {
    width: '100%',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16, // Replace gap with marginTop for React Native compatibility
  },
  text: {
    fontSize: 16,
    color: '#343434',
    fontFamily: 'Roboto',
    lineHeight: 24,
  },
  linkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#08786B',
    fontFamily: 'Roboto',
    lineHeight: 24,
  },
  // Add more styles if needed
})

export default Welcome
