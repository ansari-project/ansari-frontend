import { ConfirmationPopUp, Container, InformationPopUp, LanguageSelectorPopUp } from '@/components/ui'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const Header = () => {
  const messages = useSelector((state: RootState) => state.messagesReducer.messages)

  return (
    <div className={`bg-white fixed top-0 w-full z-30 ${messages.length !== 0 && 'md:h-10'}`}>
      <Container>
        <div className='flex flex-row justify-between md:justify-center'>
          <div className='pt-2 md:hidden'>
            <LanguageSelectorPopUp />
          </div>
          <ConfirmationPopUp />
          <div className='pt-4 px-4 md:hidden'>
            <InformationPopUp />
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Header
