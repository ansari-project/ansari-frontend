import { ansariWordDesktop, ansariWordMobile } from 'assets'
import { Button, CustomFlowbiteTheme, Flowbite, Modal } from 'flowbite-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { controller } from 'services/api'
import { clearMessages } from 'store/message-slice'
import { RootState } from 'store/store'

const customTheme: CustomFlowbiteTheme = {
  modal: {
    root: {
      base: 'fixed hidden top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full',
      show: {
        on: 'flex bg-gray-900 bg-opacity-50',
        off: 'hidden',
      },
    },
    body: {
      base: ' flex-1 overflow-auto',
    },
    content: {
      base: 'relative h-full w-full p-4 h-auto',
    },

    header: {
      popup: ' border-b-0',
      close: {
        base: 'hidden',
      },
    },
  },
}
const ConfirmationPopUp = () => {
  const [openModal, setOpenModal] = useState(false)
  const messages = useSelector((state: RootState) => state.messagesReducer.messages)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleClearMessages = () => {
    controller.abort()
    setTimeout(() => {
      dispatch(clearMessages())
      setOpenModal(false)
    }, 0)
  }

  const handleOpenModal = (setOpen: boolean) => {
    if (messages.length == 0) {
      return
    }
    setOpenModal(setOpen)
  }

  return (
    <>
      <Flowbite theme={{ theme: customTheme }}>
        {messages.length != 0 ? (
          <Button
            onClick={() => handleOpenModal(true)}
            className='hidden p-0 md:block text-center focus:z-10 focus:outline-none bg-transparent border-none border-transparent enabled:hover:bg-transparent focus:ring-transparent rounded-lg focus:ring-2'
          >
            <img src={ansariWordDesktop} className={'align-middle w-24 h-8 my-auto hover:cursor-pointer'} alt='Ansari Word Image' />
          </Button>
        ) : (
          <></>
        )}
        <Button
          onClick={() => handleOpenModal(true)}
          className='md:hidden p-0.5 text-center focus:z-10 focus:outline-none bg-transparent border-none border-transparent enabled:hover:bg-transparent focus:ring-transparent rounded-lg focus:ring-2'
        >
          <img src={ansariWordMobile} className={'align-middle '} alt='Ansari Word Image' />
        </Button>

        <Modal className='' show={openModal} size='lg' onClose={() => handleOpenModal(false)} popup dismissible>
          <Modal.Header>
            <div className='font-semibold font-roboto text-lg'>{t('startConversation')}</div>
          </Modal.Header>
          <Modal.Body>
            <span className='block h-px w-full text-black  bg-gray-200'></span>
            <div className='flex flex-col text-base font-roboto p-6 gap-2'>
              <div className='font-medium'>{t('newConversationConfirmation')}</div>
              <div className='underline font-medium'>{t('conversationLostWarning')}</div>
              <div className='flex flex-row justify-end gap-3 mt-2'>
                <Button color='gray' onClick={() => setOpenModal(false)} className='font-semibold focus:ring-0'>
                  {t('cancel')}
                </Button>
                <Button className='bg-green font-semibold' onClick={() => handleClearMessages()}>
                  {t('yes')}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Flowbite>
    </>
  )
}

export default ConfirmationPopUp
