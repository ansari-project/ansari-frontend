import { flag, languageGreen } from 'assets'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setShowIntroductionText } from 'store/message-slice'
import { AppDispatch } from 'store/store'

const IntroductionText: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const handleClickInformation = (isShow: boolean) => {
    dispatch(setShowIntroductionText(isShow))
  }

  return (
    <div className='flex flex-col p-4 gap-4 font-roboto text-sm md:bg-white'>
      <div className='font-normal'>{t('gettingWrongSometimes')}</div>
      <div className='flex flex-row gap-4'>
        <img src={flag} alt='Flag Icon' className='h-fit w-[14px]' />
        <div className='hidden md:block font-normal'>
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

        <div className='md:hidden font-normal'>
          <Trans i18nKey='flaggingInstructions.mobile'>
            If I say anything wrong, confusing, great, funny or interesting, please flag it.
            <a className='text-green underline' onClick={() => handleClickInformation(true)}>
              more
            </a>
          </Trans>
        </div>
      </div>
      <div className='flex flex-row gap-4'>
        <img src={languageGreen} alt='Language Icon' className='h-fit w-[14px]' />
        <div className='hidden md:block font-normal'>{t('multilingualMessage.desktop')}</div>

        <div className='md:hidden font-normal'>
          <Trans i18nKey='multilingualMessage.mobile'>
            I am multilingual.
            <a className='text-green underline' onClick={() => handleClickInformation(true)}>
              more
            </a>
          </Trans>
        </div>
      </div>
    </div>
  )
}

export default IntroductionText
