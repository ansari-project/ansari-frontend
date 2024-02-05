import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ChallengeIcon, ChatIcon, EndeavorFancySVG, PrayingIcon } from '../../assets'
import { useScreenSize } from '../../hooks'
import PromptCard from './PromptCard'

const PromptList: React.FC = () => {
  const { t } = useTranslation()
  const { isSmallScreen } = useScreenSize()

  const prompts = [
    { id: '1', title: t('duaToMake'), subtitle: t('inParticularSituation'), Icon: PrayingIcon, Options: {} },
    { id: '2', title: t('islamicPerspectives'), subtitle: t('onTopics'), Icon: ChatIcon, Options: {} },
    { id: '3', title: t('spiritualRemedies'), subtitle: t('challengesFacing'), Icon: ChallengeIcon, Options: {} },
  ]

  const handleSelectPrompt = (promptId: string) => {
    // Placeholder for navigation logica
    console.log('Prompt selected:', promptId)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={isSmallScreen ? styles.stackedContainer : styles.rowContainer}>
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            title={prompt.title}
            subtitle={prompt.subtitle}
            Icon={prompt.Icon as typeof EndeavorFancySVG}
            onPress={() => handleSelectPrompt(prompt.id)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24,
    width: '100%',
  },
  stackedContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    width: '100%',
  },
})

export default PromptList
