import { Container, InformationPopUp, LanguageSelectorPopUp } from 'components/ui'
import { Trans } from 'react-i18next'
const Footer = () => {
  return (
    <Container>
      <div className='flex flex-row w-full md:justify-between justify-center items-center align-middle bg-background'>
        <div className='p-2 md:p-4 px-3 md:px-6 hidden md:block'>
          <LanguageSelectorPopUp />
        </div>
        <div className='text-center text-xs text-black py-2 flex-grow block'>
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
        <div className='p-2 md:p-4 px-3 md:px-6 hidden md:block'>
          <InformationPopUp />
        </div>
      </div>
    </Container>
  )
}

export default Footer
