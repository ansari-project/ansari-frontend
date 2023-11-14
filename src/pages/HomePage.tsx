import { backgroundImage, compositeLogo } from 'assets'
import { Message, SuggestionMessages, InputMessageBox, MessageTemplate } from 'components/home'
import { Footer, Header } from 'components/layout'
import { Container } from 'components/ui'
import { Role } from 'constant'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'

const HomePage: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messages = useSelector((state: RootState) => state.messagesReducer.messages)
  const streamMessage = useSelector((state: RootState) => state.messagesReducer.streamMessage)
  const isAssistantReading = useSelector((state: RootState) => state.messagesReducer.isAssistantReading)
  const error = useSelector((state: RootState) => state.messagesReducer.hasError)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className='bg-background overflow-y-hidden h-screen'>
      <Header />
      <Container>
        <div
          className={`h-screen flex flex-col ${messages.length === 0 ? 'pb-32 md:pb-40' : 'md:pb-20 '}font-roboto text-black justify-end`}
        >
          {messages.length === 0 ? (
            <div className='flex flex-col mx-4 lg:mb-0 md:mx-0 h-full overflow-y-hidden justify-start md:justify-center md:px-36 xl:px-64'>
              <img src={compositeLogo} alt='BackgroundImage' className='mx-auto md:w-[380px] xl:w-116' />
            </div>
          ) : (
            <main className='w-full h-full overflow-y-auto z-10'>
              <div className='flex flex-col px-4 mt-16 md:px-36 xl:px-64 w-full pb-24 md:pb-20 text-center rounded-sm overflow-x-hidden'>
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
                {!!streamMessage?.length && (
                  <MessageTemplate hasMargin>
                    <Message error={error} loading={isAssistantReading} key={streamMessage} content={streamMessage} type='receiver' />
                  </MessageTemplate>
                )}
                <div ref={messagesEndRef} className='pb-4'></div>
              </div>
            </main>
          )}
        </div>
      </Container>
      <div className={'fixed w-full z-10 right-0 bottom-0'}>
        {messages.length === 0 ? (
          <Container>
            <div className='px-4 md:px-28 xl:px-64 pb-4'>
              <SuggestionMessages />
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
