import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { CloseIcon, FlagIcon, InfoIcon, LanguageIcon } from '../assets'
import { GetEnv } from '../utils'
import Subscription from './Subscription'

const InfoPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { width } = useWindowDimensions()

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Pressable
        onPress={() => {
          setIsOpen(true)
        }}
        style={styles.button}
      >
        <InfoIcon />
      </Pressable>

      <Modal animationType='fade' transparent={true} visible={isOpen} onRequestClose={togglePopup}>
        <View style={styles.container} onClick={togglePopup}>
          <View style={styles.modalView}>
            <Pressable onPress={togglePopup} style={styles.infoContainer}>
              {/* Replace CloseIcon with an icon from react-native-vector-icons */}
              <Text style={styles.titleText}>{t('information')}</Text>
              <CloseIcon />
            </Pressable>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{t('gettingWrongSometimes')}</Text>
              <View style={styles.rowGap16}>
                <FlagIcon />
                <Pressable style={styles.modalText} onPress={() => Linking.openURL(GetEnv('FEEDBACK_MAIL_TO'))}>
                  <Text style={styles.modalText}>
                    <Trans
                      i18n={i18n}
                      parent={Text}
                      i18nKey='flaggingInstructions.desktop'
                      components={{
                        1: <Text style={{ textDecorationLine: 'underline', color: '#08786B' }} />,
                      }}
                      values={{ email: GetEnv('FEEDBACK_EMAIL') }}
                    />
                  </Text>
                </Pressable>
              </View>
              <View style={styles.rowGap16}>
                <LanguageIcon />
                <Text style={styles.modalText}>{t('multilingualMessage.desktop')}</Text>
              </View>
              <View style={styles.rowGap16}>
                <Pressable style={styles.modalText}>
                  <Text style={styles.modalText}>
                    <Trans
                      i18nKey='comprehensiveGuide'
                      components={{
                        1: (
                          <a
                            target='_blank'
                            rel='noreferrer'
                            style={{ textDecorationLine: 'underline', color: '#08786B' }}
                            href={process.env.REACT_APP_COMPREHENSIVE_GUIDE_URL}
                          />
                        ),
                      }}
                      i18n={i18n}
                    />
                  </Text>
                </Pressable>
              </View>

              <View style={styles.bottomContainer}>{width <= 768 && <Subscription />}</View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    elevation: 2,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: document.dir === 'rtl' ? 'flex-start' : 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    fontFamily: 'Roboto',
  },
  modalView: {
    height: '100%',
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'white',
    borderRadius: 0,
    paddingHorizontal: 5,
    alignItems: 'center',
    boxShadowColor: '#000',
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 0,
    elevation: 5,
  },
  modalContent: {
    marginVertical: 20,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 10,
    alignItems: 'flex-start',
    boxShadowColor: '#000',
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 0,
    elevation: 5,
    gap: 16,
    flexGrow: 1, // make the modalContent view expand and fill the available space
  },
  rowGap16: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'left',
    color: '#343434',
    fontFamily: 'Roboto', // Make sure you have this font loaded on native
    lineHeight: 24,
    flexShrink: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#161616',
  },
  infoText: {
    fontSize: 14,
    color: '#343434',
    fontFamily: 'Roboto', // Make sure you have this font loaded on native
    lineHeight: 21,
    textAlign: 'left',
    flexShrink: 1, // ensure the text wraps
  },
  infoContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 72,
    padding: 24,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    display: 'inline-flex',
  },
  bottomContainer: {
    alignItems: 'center',
    marginTop: 'auto', // push the bottomContent to the bottom of the modalContent view
  },
  // Define any other styles for icons or additional elements here
})

export default InfoPopup
