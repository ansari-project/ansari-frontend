import { AppDispatch, RootState } from '@/store/store'
import { CloseIcon, FlagIcon, InfoIcon, LanguageIcon } from '@endeavorpal/assets'
import { useAuth, useDirection, useScreenInfo } from '@endeavorpal/hooks'
import { toggleInformationPopup } from '@endeavorpal/store'
import { GetEnv } from '@endeavorpal/utils'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Subscription from './Subscription'

const InfoPopup: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { isSmallScreen } = useScreenInfo()
  const { isRTL } = useDirection()
  const { isAuthenticated } = useAuth()
  const textDirection = isRTL ? { textAlign: 'right' } : { textAlign: 'left' }
  const modalTextStyle = [styles.modalText, textDirection]
  const isInfoPopupOpen = useSelector((state: RootState) => state.informationPopup.isOpen)
  const dispatch = useDispatch<AppDispatch>()
  const togglePopup = () => {
    dispatch(toggleInformationPopup(!isInfoPopupOpen))
  }

  const iconColor = isAuthenticated ? '#fff' : '#08786b'

  return (
    <>
      <Pressable
        onPress={() => {
          togglePopup()
        }}
        style={styles.button}
      >
        <InfoIcon stroke={iconColor} />
      </Pressable>

      <Modal animationType='fade' transparent={true} visible={isInfoPopupOpen} onRequestClose={togglePopup}>
        <View style={styles.container} onClick={togglePopup}>
          <View style={styles.modalView}>
            <Pressable onPress={togglePopup} style={styles.infoContainer}>
              {/* Replace CloseIcon with an icon from react-native-vector-icons */}
              <Text style={styles.titleText}>{t('information')}</Text>
              <CloseIcon />
            </Pressable>
            <View style={styles.modalContent}>
              <Text style={modalTextStyle}>{t('gettingWrongSometimes')}</Text>
              <View style={styles.rowGap16}>
                <FlagIcon />
                <Pressable style={modalTextStyle} onPress={() => Linking.openURL(GetEnv('FEEDBACK_MAIL_TO'))}>
                  <Text style={modalTextStyle}>
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
                <Text style={modalTextStyle}>{t('multilingualMessage.desktop')}</Text>
              </View>
              <View style={styles.rowGap16}>
                <Pressable style={modalTextStyle}>
                  <Text style={modalTextStyle}>
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

              <View style={styles.bottomContainer}>{isSmallScreen && <Subscription />}</View>
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
    alignItems: 'flex-start',
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
