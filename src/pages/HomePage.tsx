import { backgroundImage, compositeLogo, compositeLogoMobile } from 'assets'
import { Message, SuggestionMessages, InputMessageBox, MessageTemplate } from 'components/home'
import { Footer, Header } from 'components/layout'
import { Container, IntroductionText } from 'components/ui'
import { Role } from 'constant'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'

const HomePage: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messages = useSelector((state: RootState) => state.messagesReducer.messages)
  const streamMessage = useSelector((state: RootState) => state.messagesReducer.streamMessage)
  const isAssistantReading = useSelector((state: RootState) => state.messagesReducer.isAssistantReading)
  const isAssistantStopped = useSelector((state: RootState) => state.messagesReducer.isAssistantStopped)
  const error = useSelector((state: RootState) => state.messagesReducer.hasError)

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [streamMessage])

  return (
    <div className='bg-background overflow-y-hidden h-screen'>
      <Header />
      <Container>
        <div
          className={`h-screen flex flex-col ${messages.length === 0 ? 'pb-32 md:pb-40' : 'md:pb-20 '}font-roboto text-black justify-end`}
        >
          {messages.length === 0 ? (
            <div className='mx-4 lg:mb-0 md:mx-0 h-full md:px-36 xl:px-64 overflow-y-hidden'>
              <div className='flex flex-col justify-start lg:justify-center h-full'>
                <img src={compositeLogo} alt='BackgroundImage' className='hidden md:block mx-auto md:w-[380px] xl:w-116' />
                <img src={compositeLogoMobile} alt='BackgroundImage' className=' md:hidden mx-auto pt-8' />
              </div>
            </div>
          ) : (
            <main className='w-full h-full overflow-y-auto z-10'>
              <div className='flex flex-col px-4 mt-28 md:px-36 xl:px-64 w-full md:pb-24 pb-20 text-center rounded-sm overflow-x-hidden'>
                {messages.map((message, index) => (
                  <MessageTemplate key={index} hasMargin={index % 2 == 1}>
                    <Message
                      key={index}
                      error={message.error}
                      content={message.content}
                      type={message.role === Role.ASSISTANT ? 'receiver' : 'sender'}
                    />
                  </MessageTemplate>
                ))}
                {!!streamMessage?.length && !isAssistantStopped && (
                  <MessageTemplate hasMargin>
                    <Message error={error} loading={isAssistantReading} key={streamMessage} content={streamMessage} type='receiver' />
                  </MessageTemplate>
                )}
                <div ref={messagesEndRef} className='pb-2'></div>
              </div>
            </main>
          )}
        </div>
      </Container>
      <div className={'fixed w-full z-10 right-0 bottom-0'}>
        {messages.length === 0 ? (
          <Container>
            <div className='flex flex-col gap-4 px-4 md:px-28 xl:px-64 overflow-y-auto landscape:pt-12 landscape:h-56 landscape:md:h-64 lg:landscape:h-auto'>
              <IntroductionText />
              <div className='pb-4'>
                <SuggestionMessages />
              </div>
            </div>
          </Container>
        ) : (
          <></>
        )}
        <InputMessageBox />
        <Footer />
      </div>
      {messages.length !== 0 && (
        <div className='hidden lg:block fixed w-screen -bottom-24 '>
          <img src={backgroundImage} alt='Background Image' className='w-116 bottom-0  mx-auto' />
        </div>
      )}
    </div>
  )
}

export default HomePage
