import { chatDeleteLine, flag, information, languageGreen } from 'assets'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setShowIntroductionText } from 'store/message-slice'
import { AppDispatch, RootState } from 'store/store'
const InformationPopUp: React.FC = () => {
  const { t } = useTranslation()
  const isRtl = document.dir === 'rtl'
  const messages = useSelector((state: RootState) => state.messagesReducer.messages)
  const showIntroductionText = useSelector((state: RootState) => state.messagesReducer.showIntroductionText)
  const dispatch = useDispatch<AppDispatch>()
  const handleClickInformation = () => {
    dispatch(setShowIntroductionText(!showIntroductionText))
  }

  const containerClass = `z-50 flex fixed top-0 ${isRtl ? 'left-0' : 'right-0 '} min-h-screen duration-300 transition-opacity`

  return (
    <>
      <img src={information} alt='Information Icon' className='w-5 cursor-pointer' onClick={handleClickInformation} />
      <div
        className={`${showIntroductionText ? 'bg-black opacity-40 w-screen h-screen z-50 fixed top-0 left-0 hidden md:block' : 'hidden'}`}
        onClick={handleClickInformation}
      ></div>
      <div
        className={` ${containerClass} ${showIntroductionText ? 'opacity-100 md:w-80 w-screen' : 'opacity-0 w-0'} 
        `}
      >
        {showIntroductionText && (
          <div className='z-50'>
            <div className={`flex flex-row justify-between p-6 bg-white ${messages.length !== 0 && 'md:pt-12'}`}>
              <div className='font-bold'>{t('information')}</div>
              <button>
                <img src={chatDeleteLine} alt='Chat Delete Icon' onClick={handleClickInformation} />
              </button>
            </div>
            <span className='h-px w-full bg-slate-200'></span>
            <div className='flex flex-col pt-4 px-6 overflow-scroll gap-4 items-stretch h-screen justify-stretch justify-items-stretch bg-white font-roboto '>
              <div className='font-normal'>{t('gettingWrongSometimes')}</div>
              <div className='flex flex-row gap-4'>
                <img src={flag} alt='Flag Icon' className='h-fit' />
                <div>
                  <Trans i18nKey='flaggingInstructions.desktop'>
                    If I say anything wrong, confusing, great, funny or interesting, please let my authors know by sending e-mail to
                    <a
                      href='mailto:feedback@ansari.chat'
                      target='_blank'
                      rel='noreferrer'
                      className='text-green-bold  hover:text-green underline font-normal'
                    >
                      feedback@ansari.chat
                    </a>
                  </Trans>
                </div>
              </div>
              <div className='flex flex-row gap-4'>
                <img src={languageGreen} alt='Language Icon' className='h-fit' />
                <div className='md:font-light'>{t('multilingualMessage.desktop')}</div>
              </div>
              <div>
                <Trans i18nKey='comprehensiveGuide'>
                  Click
                  <a
                    href='https://waleedkadous.github.io/ansari-backend/'
                    target='_blank'
                    rel='noreferrer'
                    className='text-green-bold  hover:text-green underline font-normal'
                  >
                    here
                  </a>
                  for a more comprehensive guide
                </Trans>
                .
              </div>
              <div>
                <Trans i18nKey='subscribe'>
                  Subscribe
                  <a
                    href='http://eepurl.com/iFCJaA'
                    target='_blank'
                    rel='noreferrer'
                    className='text-green-bold  hover:text-green underline font-normal'
                  >
                    {' '}
                    to the Ansari mailing list for updates!
                  </a>
                </Trans>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default InformationPopUp
