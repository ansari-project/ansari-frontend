import { LanguageIcon } from '@/components/svg'
import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, Text, View } from 'react-native'
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view'
import { useSelector } from 'react-redux'
import { getLanguages, setLanguage } from '@/i18n/i18n'

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

  const languageCode = i18n.language.split('-')[0]
  // Get languages from the centralized function with the current language marked as active
  // Only include RTL languages on web platform
  const languages = getLanguages(languageCode, Platform.OS === 'web')

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

  const reorderedLanguages = reorderLanguages(languages, languageCode)

  /**
   * Handles the change of language.
   *
   * @param {string} language - The language code to switch to.
   */
  const handleLanguageChange = useCallback(async (language: string) => {
    setIsVisible(false)
    await setLanguage(language)
  }, [])

  return (
    <View>
      <Pressable ref={touchableRef} className='p-2 rounded' onPress={() => setIsVisible(!isVisible)}>
        <LanguageIcon stroke={theme.iconFill} hoverStroke={theme.hoverColor} />
      </Pressable>
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
        popoverStyle={{
          position: 'absolute',
          top: 30,
          width: 180,
          borderRadius: 4,
          borderColor: theme.primaryColor,
          backgroundColor: theme.popupBackgroundColor,
          marginLeft: 40,
          marginRight: 40,
          alignItems: 'flex-end',
          paddingVertical: 20,
          paddingHorizontal: 16,
          overflow: 'visible',
        }}
      >
        <View className='w-full'>
          {reorderedLanguages.map((language) => (
            <Pressable
              key={language.code}
              className='p-2 rounded items-center'
              onPress={() => handleLanguageChange(language.code)}
              android_ripple={Platform.OS === 'android' ? { color: theme.hoverColor } : undefined}
              style={({ pressed }) => (Platform.OS === 'ios' ? [{ opacity: pressed ? 0.7 : 1 }] : undefined)}
            >
              <Text
                className={language.isActive ? 'font-bold' : ''}
                style={{ color: language.isActive ? theme.hoverColor : theme.textColor }}
              >
                {language.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </Popover>
    </View>
  )
}

export default LanguageSelector
