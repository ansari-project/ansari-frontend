import { flag, languageGreen } from 'assets'
import React from 'react'
import { useTranslation } from 'react-i18next'

const IntroductionText: React.FC = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col p-4 gap-4 bg-white font-roboto'>
      <div className='font-normal'>{t('gettingWrongSometimes')}</div>
      <div className='flex flex-row gap-4'>
        <img src={flag} alt='Flag Icon' className='h-fit' />
        <div className='md:font-light'>{t('flaggingInstructions')}</div>
      </div>
      <div className='flex flex-row gap-4'>
        <img src={languageGreen} alt='Language Icon' className='h-fit' />
        <div className='md:font-light'>{t('multilingualMessage')}</div>
      </div>
    </div>
  )
}

export default IntroductionText
