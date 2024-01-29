import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { LanguageIcon } from '../assets'

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { i18n } = useTranslation()

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
  const reorderedLanguages = reorderLanguages(languages, i18n.language)

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

    setIsOpen(false) // Close the language selector after selection.
  }

  return (
    <>
      <Pressable style={styles.button} onPress={() => setIsOpen(true)}>
        <LanguageIcon />
      </Pressable>
      <Modal visible={isOpen} animationType='fade' transparent={true}>
        <View style={styles.modalContainer} onClick={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            {reorderedLanguages.map((language) => (
              <Pressable
                key={language.code}
                style={styles.modalButton}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text style={[styles.modalText, language.isBold && styles.boldText]}>{language.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  )
}
const styles = StyleSheet.create({
  button: {
    padding: 8,
    margin: 4,
    backgroundColor: '#fffff',
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: document.dir === 'rtl' ? 'flex-start' : 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    position: 'absolute',
    top: '56px',
    width: '180px',
    marginLeft: 10,
    marginRight: 10,
  },
  modalButton: {
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ffffff',
    alignItems: 'center',
  },
  modalText: {
    color: '#08786b',
  },
  boldText: {
    fontWeight: 'bold',
  },
})

export default LanguageSelector
