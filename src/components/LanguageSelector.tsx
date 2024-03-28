import { LanguageIcon } from '@endeavorpal/assets'
import { useDirection, useScreenInfo } from '@endeavorpal/hooks'
import { RootState } from '@endeavorpal/store'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view'
import { useSelector } from 'react-redux'

export type Props = {
  isTop: boolean
}

const LanguageSelector: React.FC<Props> = (props: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const theme = useSelector((state: RootState) => state.theme.theme)
  const { isRTL } = useDirection()

  const { i18n } = useTranslation()
  const touchableRef = useRef(null)
  const { height, width } = useScreenInfo()

  const languages: { code: string; name: string; isActive: boolean }[] = [
    { code: 'en', name: 'English', isActive: false },
    { code: 'ar', name: 'العربية', isActive: false },
    { code: 'ur', name: 'اردو', isActive: false },
    { code: 'tur', name: 'Türkçe', isActive: false },
    { code: 'bs', name: 'Bosanski', isActive: false },
    { code: 'id', name: 'Bahasa Indonesia', isActive: false },
    { code: 'fr', name: 'Français', isActive: false },
  ]

  const reorderLanguages = (
    languages: { code: string; name: string; isActive: boolean }[],
    selectedLanguage: string,
  ) => {
    // find the index of the selected language in the languages array
    const selectedLanguageIndex = languages.findIndex((language) => language.code === selectedLanguage)

    // get the languages that come before the selected language
    const languagesBeforeSelected = languages.slice(0, selectedLanguageIndex)

    // get the languages that come after the selected language
    const languagesAfterSelected = languages.slice(selectedLanguageIndex + 1)

    // create a new array that contains the selected language first, followed by the languages that come before it, and then the languages that come after it
    const selectedLang = languages[selectedLanguageIndex]
    selectedLang.isActive = true
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

  const styles = StyleSheet.create({
    button: {
      padding: 8,
      borderRadius: 4,
    },
    popupContent: {
      top: '30px',
      width: 180,
      borderRadius: 4,
      borderColor: theme.primaryColor,
      backgroundColor: theme.popupBackgroundColor,
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
      alignItems: 'center',
    },
    popupItemText: {
      color: theme.textColor,
    },
    activeText: {
      fontWeight: 'bold',
      color: theme.hoverColor,
    },
  })

  return (
    <View>
      <Pressable ref={touchableRef} style={styles.button} onPress={() => setIsVisible(!isVisible)}>
        <LanguageIcon stroke={theme.iconFill} hoverStroke={theme.hoverColor} fill={theme.backgroundColor} />
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
            x: props.isTop ? (isRTL ? -1 * width + 230 : width - 230) : 0,
            y: props.isTop ? 0 : height - 50 * (reorderedLanguages.length + 1),
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
                <Text style={[styles.popupItemText, language.isActive && styles.activeText]}>{language.name}</Text>
              </Pressable>
            ))}
          </View>
        </Popover>
      )}
    </View>
  )
}

export default LanguageSelector
