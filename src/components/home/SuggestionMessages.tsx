import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { addMessage } from '@/store/message-slice'

const SuggestionMessages: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleSendMessage = (text: string) => {
    dispatch(addMessage(text))
  }

  const suggestionData = [
    {
      header: t('duaToMake'),
      text: t('inParticularSituation'),
      icon: '/icons/praying.svg',
    },
    {
      header: t('spiritualRemedies'),
      text: t('challengesFacing'),
      icon: '/icons/challenge.svg',
    },
    {
      header: t('islamicPerspectives'),
      text: t('onTopics'),
      icon: '/icons/chat.svg',
    },
  ]

  return (
    <div className='flex flex-col gap-2 md:flex-row md:gap-5 w-full md:flex-wrap lg:flex-nowrap'>
      {suggestionData.map(({ icon, header, text }, index) => (
        <div
          key={index}
          onClick={() => handleSendMessage(`${header} ${text}`)}
          className='flex flex-row p-3 md:p-4 gap-6 rounded-sm bg-white w-full hover:text-orange hover:cursor-pointer'
        >
          <img src={icon} alt='Suggestion Icon' className='w-8 my-auto' />
          <div className='flex flex-col'>
            <div className='font-semibold text-sm'>{header}</div>
            <div className='font-normal text-sm'>{text}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SuggestionMessages
