import { Container, InformationPopUp, LanguageSelectorPopUp } from 'components/ui'
import { useTranslation } from 'react-i18next'
const Footer = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <div className='flex flex-row w-full md:justify-between justify-center items-center align-middle bg-background'>
        <div className='p-2 md:p-4 px-3 md:px-6 hidden md:block'>
          <LanguageSelectorPopUp />
        </div>
        <div className='text-center text-xs text-black py-2 flex-grow block'>{t('poweredBy')}</div>
        <div className='p-2 md:p-4 px-3 md:px-6 hidden md:block'>
          <InformationPopUp />
        </div>
      </div>
    </Container>
  )
}

export default Footer
