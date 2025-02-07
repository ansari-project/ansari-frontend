import { ErrorMessage } from '@/components/ui'
import React from 'react'
import { Trans } from 'react-i18next'

interface MessageProps {
  type: 'receiver' | 'sender'
  content: string
  error?: boolean
  loading?: boolean
}

const Message: React.FC<MessageProps> = ({ type, content, error, loading }) => {
  return (
    <>
      <div
        className={`${type === 'receiver' ? 'bg-white' : 'bg-user-message-color'} md:gap-6  m-auto w-full min-h-[50px] p-4`}
      >
        <div className={'flex gap-4 text-base  md:gap-6 md:max-w-2xl xl:max-w-full'}>
          <div className='flex-shrink-0 flex flex-col relative justify-start'>
            <div className='relative flex'>
              <img
                src={type === 'sender' ? '/icons/user.svg' : '/icons/logo.svg'}
                alt='MessagePhoto'
                className={`${type === 'sender' ? 'bg-orange p-2' : 'bg-background'} w-8 rounded-md`}
              ></img>
              {type === 'receiver' && error ? (
                <img
                  src='/icons/warningCircle.svg'
                  alt='Warning image'
                  className={`absolute ${
                    document.dir !== 'rtl' ? '-right-3 md:-right-4' : '-left-3 md:-left-4'
                  } bottom-0 md:-bottom-1  h-4 md:h-5`}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
          {error && (
            <ErrorMessage>
              <Trans i18nKey='backendErrorMessage'>
                {' '}
                <a
                  href='mailto:feedback@ansari.chat'
                  className='text-green-bold hover:text-green-bold underline font-normal'
                >
                  feedback@ansari.chat
                </a>
              </Trans>
            </ErrorMessage>
          )}
          {loading && <img src='/icons/messageLoader.svg' alt='MessageLoader image' />}
          <div
            className={`min-h-[20px] h-auto w-auto text-sm md:text-base text-start  my-auto whitespace-break-spaces ${
              type === 'sender' ? 'text-green font-semibold' : 'text-black font-normal md:font-medium'
            }`}
          >
            {content}
          </div>
        </div>
      </div>
    </>
  )
}

export default Message
