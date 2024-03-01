import { ChallengeIcon, ChatIcon, EndeavorFancySVG, PrayingIcon } from '@endeavorpal/assets'
import { useScreenInfo } from '@endeavorpal/hooks'
import PromptsService, { PromptsByCategory } from '@endeavorpal/services/PromptsService'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
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
      style={{ width: '100%' }}
      contentContainerStyle={[styles.container, isSmallScreen ? styles.stackedContainer : styles.rowContainer]}
    >
      <View style={isSmallScreen ? styles.promptCardStacked : styles.promptCardRow}>
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            title={prompt.title}
            subtitle={prompt.subtitle}
            Icon={prompt.Icon as typeof EndeavorFancySVG}
            onPress={() => handleSelectPrompt(prompt.description)}
            stacked={isSmallScreen}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16, // Adjust padding as needed
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Adjusted for React Native compatibility
    width: '100%',
  },
  stackedContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  promptCardRow: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 16,
    width: '100%',
  },
  promptCardStacked: {
    width: '100%', // Cards expand to fill the container on smaller screens
    marginBottom: 16, // Provide some space between stacked cards
  },
})

export default PromptList
