import { ChallengeIcon, ChatIcon, ReactNativeSvg, PrayingIcon } from '@/components/svg'
import { useScreenInfo } from '@/hooks'
import PromptsService, { PromptsByCategory } from '@/services/PromptsService'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import PromptCard from './PromptCard'

type PromptListProps = {
  // eslint-disable-next-line no-unused-vars
  onPromptSelect: (description: string) => void
}

const PromptList: React.FC<PromptListProps> = ({ onPromptSelect }) => {
  const { t, i18n } = useTranslation()
  const { isSmallScreen } = useScreenInfo()

  const [loadedPrompts, setLoadedPrompts] = useState<PromptsByCategory>({} as PromptsByCategory)

  useEffect(() => {
    const loadPrompts = async () => {
      const promptsForLanguage = await PromptsService(i18n.language)
      setLoadedPrompts(promptsForLanguage)
    }
    loadPrompts()
  }, [i18n.language])

  const promptOptions = new Map()
  promptOptions.set('duaIcon', PrayingIcon)
  promptOptions.set('duaTitle', t('duaToMake'))
  promptOptions.set('perspectivesTitle', t('islamicPerspectives'))
  promptOptions.set('perspectivesIcon', ChatIcon)
  promptOptions.set('remediesTitle', t('spiritualRemedies'))
  promptOptions.set('remediesIcon', ChallengeIcon)

  const prompts = Object.keys(loadedPrompts).flatMap((category) => [
    {
      id: loadedPrompts[category][0]['id'],
      title: promptOptions.get(`${category}Title`),
      subtitle: loadedPrompts[category][0]['title'],
      description: loadedPrompts[category][0]['description'],
      Icon: promptOptions.get(`${category}Icon`),
      Options: {},
    },
  ])

  const handleSelectPrompt = (promptDescription: string) => {
    onPromptSelect(promptDescription)
  }

  return (
    <ScrollView
      className='w-full'
      contentContainerStyle={{
        alignItems: 'center',
        flexDirection: isSmallScreen ? 'column' : 'row',
        flexWrap: isSmallScreen ? undefined : 'wrap',
        justifyContent: isSmallScreen ? undefined : 'space-around',
        width: '100%',
      }}
    >
      <View className={`${isSmallScreen ? 'w-full mb-4 flex' : 'flex-row my-2 w-full mb-4'}`}>
        {prompts.map((prompt, index) => (
          <PromptCard
            key={prompt.id}
            isMiddle={index === 1}
            title={prompt.title}
            subtitle={prompt.subtitle}
            Icon={prompt.Icon as typeof ReactNativeSvg}
            onPress={() => handleSelectPrompt(prompt.description)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

export default PromptList
