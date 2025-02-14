import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, stopAssistant } from '@/store/message-slice'
import { RootState } from '@/store/store'
import { Container } from '@/components/ui'
import { controller } from '@/services/api'
import { Platform } from 'react-native'

const InputMessageBox = () => {
  const [messageText, setMessageText] = useState('')
  const dispatch = useDispatch()
  const sendMessageIcon = document.dir === 'rtl' ? '/icons/paperPlaneLeft.svg' : '/icons/paperPlaneRight.svg'
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const isAssistantWriting = useSelector((state: RootState) => state.messagesReducer.isAssistantWriting)
  const messages = useSelector((state: RootState) => state.messagesReducer.messages)

  const handleSendMessage = () => {
    const textarea = textareaRef.current

    if (textarea) {
      textarea.style.height = '36px'
      textarea.style.overflowY = 'hidden'
      if (messageText.trim() !== '') {
        dispatch(addMessage(messageText))
        setMessageText('')
      }
    }
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value)
    handleInputAutoSizing(e)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement
    target.style.height = `${target.scrollHeight}px`

    if (event.key === 'Enter' && !event.shiftKey && isAssistantWriting === false && Platform.OS === 'web') {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputAutoSizing = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement
    const maxHeight = 200

    target.style.height = `${target.scrollHeight}px`

    if (messages.length === 0) {
      if (target.scrollHeight > maxHeight) {
        target.style.overflowY = 'auto'
        target.style.height = `${maxHeight}px`
      }
    }

    if (textareaRef.current) {
      const target = textareaRef.current
      const maxHeight = 200
      target.style.height = '36px'
      if (target.scrollHeight < maxHeight && target.value === '') {
        target.style.height = '36px'
      } else {
        target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`
        target.style.overflowY = 'auto'
      }
    }
  }

  const handleStopAssitantWriting = () => {
    controller.abort()
    dispatch(stopAssistant())
  }

  return (
    <Container>
      <form
        className=' w-full flex flex-row px-3 md:px-28 xl:px-64 z-30'
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
      >
        <div className='flex h-full flex-1 md:flex-col'>
          <div className='flex flex-row w-full p-2 flex-grow border border-black/10 bg-white rounded-md '>
            <textarea
              ref={textareaRef}
              placeholder={t('promptPlaceholder')}
              tabIndex={0}
              value={messageText}
              onKeyDown={handleKeyDown}
              onChange={handleMessageChange}
              className='w-full resize-none bg-transparent h-9 overflow-hidden leading-5 text-stone-500 border-none focus-visible:ring-0'
            ></textarea>
            <div className='flex flex-col justify-center'>
              {isAssistantWriting ? (
                <img
                  src='/icons/stopResponse.svg'
                  alt='Stop Response Icon'
                  className='w-8 px-1 py-2 rounded-md hover:cursor-pointer'
                  onClick={() => handleStopAssitantWriting()}
                />
              ) : (
                <img
                  src={sendMessageIcon}
                  onClick={() => handleSendMessage()}
                  alt='PaperPlaneIcon'
                  className={`pl-3 rounded-md text-gray-400 bottom-1.5s h-auto hover:cursor-pointer hover:text-gray-600 ${
                    document.dir === 'rtl' ? 'pr-2' : ''
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </Container>
  )
}

export default InputMessageBox
