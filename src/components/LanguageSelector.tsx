import { LanguageIcon } from '@endeavorpal/assets'
import { useScreenInfo } from '@endeavorpal/hooks'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view'

const LanguageSelector = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { i18n } = useTranslation()
  const touchableRef = useRef(null)
  const { width } = useScreenInfo()
  const isRTL = i18n.dir() === 'rtl'

  const languages: { code: string; name: string; isBold: boolean }[] = [
    { code: 'en', name: 'English', isBold: false },
    { code: 'ar', name: 'العربية', isBold: false },
    { code: 'ur', name: 'اردو', isBold: false },
    { code: 'tur', name: 'Türkçe', isBold: false },
    { code: 'bs', name: 'Bosanski', isBold: false },
    { code: 'id', name: 'Bahasa Indonesia', isBold: false },
    { code: 'fr', name: 'Français', isBold: false },
  ]

  const reorderLanguages = (languages: { code: string; name: string; isBold: boolean }[], selectedLanguage: string) => {
    // find the index of the selected language in the languages array
    const selectedLanguageIndex = languages.findIndex((language) => language.code === selectedLanguage)

    // get the languages that come before the selected language
    const languagesBeforeSelected = languages.slice(0, selectedLanguageIndex)

    // get the languages that come after the selected language
    const languagesAfterSelected = languages.slice(selectedLanguageIndex + 1)

    // create a new array that contains the selected language first, followed by the languages that come before it, and then the languages that come after it
    const selectedLang = languages[selectedLanguageIndex]
    selectedLang.isBold = true
    return [selectedLang, ...languagesBeforeSelected, ...languagesAfterSelected]
  }
  // Extract the language code from i18n.language if it comes in the form of en-US
  const languageCode = i18n.language.split('-')[0]
  const reorderedLanguages = reorderLanguages(languages, languageCode)

  /**
   * Handles the change of language.
   *
   * @param {string} language - The language code to switch to.
   */
  const handleLanguageChange = (language: string) => {
    // Change the language and update the direction.
    i18n.changeLanguage(language).then(() => {
      document.dir = i18n.dir(language)
    })

    setIsVisible(false) // Close the language selector after selection.
  }

  return (
    <View>
      <Pressable ref={touchableRef} style={styles.button} onPress={() => setIsVisible(!isVisible)}>
        <LanguageIcon stroke='#08786b' />
      </Pressable>
      {/* This ensures that the Popover is only attempted to be rendered when touchableRef.current is not null,
      indicating that the Pressable has been mounted and the ref has been attached. */}
      {touchableRef.current && (
        <Popover
          from={touchableRef}
          mode={PopoverMode.RN_MODAL}
          placement={PopoverPlacement.FLOATING}
          isVisible={isVisible}
          onRequestClose={() => setIsVisible(false)}
          displayArea={{
            x: isRTL ? -1 * width + 230 : width - 230,
            y: -1,
            width: 180,
            height: 50 * reorderedLanguages.length,
          }}
          popoverStyle={[
            styles.popupContent,
            {
              alignItems: 'flex-end',
              paddingTop: 20, // add some space for the arrow
              paddingBottom: 20, // adjust the padding to fit the arrow
              paddingLeft: 16,
              paddingRight: 16,
              overflow: 'visible', // make sure the arrow is visible outside the container
            },
          ]}
        >
          <View
            style={[
              styles.popupItems,
              // { transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }] }
            ]}
          >
            {reorderedLanguages.map((language) => (
              <Pressable
                key={language.code}
                style={styles.popupItem}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text style={[styles.popupItemText, language.isBold && styles.boldText]}>{language.name}</Text>
              </Pressable>
            ))}
          </View>
        </Popover>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  button: {
    padding: 8,
    margin: 4,
    backgroundColor: '#fffff',
    borderRadius: 4,
  },
  popupContent: {
    top: '30px',
    width: 180,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    padding: 8,
    position: 'absolute',
    marginLeft: 40,
    marginRight: 40,
  },
  popupItems: {
    width: '100%',
  },
  popupItem: {
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ffffff',
    alignItems: 'center',
  },
  popupItemText: {
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
})

export default LanguageSelector
