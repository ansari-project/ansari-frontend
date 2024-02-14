import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ChallengeIcon, ChatIcon, EndeavorFancySVG, PrayingIcon } from '../../assets'
import { useScreenInfo } from '../../hooks'
import PromptCard from './PromptCard'

const PromptList: React.FC = () => {
  const { t } = useTranslation()
  const { isSmallScreen } = useScreenInfo()

  const prompts = [
    { id: '1', title: t('duaToMake'), subtitle: t('inParticularSituation'), Icon: PrayingIcon, Options: {} },
    { id: '2', title: t('islamicPerspectives'), subtitle: t('onTopics'), Icon: ChatIcon, Options: {} },
    { id: '3', title: t('spiritualRemedies'), subtitle: t('challengesFacing'), Icon: ChallengeIcon, Options: {} },
  ]

  const handleSelectPrompt = (promptId: string) => {
    // Placeholder for navigation logic
    console.log('Prompt selected:', promptId)
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
            onPress={() => handleSelectPrompt(prompt.id)}
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
