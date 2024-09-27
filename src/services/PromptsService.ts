import arPrompts from '@endeavorpal/i18n/locales/ar/prompts.json'
import bsPrompts from '@endeavorpal/i18n/locales/bs/prompts.json'
import enPrompts from '@endeavorpal/i18n/locales/en/prompts.json'
import frPrompts from '@endeavorpal/i18n/locales/fr/prompts.json'
import idPrompts from '@endeavorpal/i18n/locales/id/prompts.json'
import tmlPrompts from '@endeavorpal/i18n/locales/tml/prompts.json'
import turPrompts from '@endeavorpal/i18n/locales/tur/prompts.json'
import urPrompts from '@endeavorpal/i18n/locales/ur/prompts.json'

// Define a type for individual prompt entries
export type Prompt = {
  id: string
  title: string
  description: string
}

// Define a type for the collection of prompts, categorized by type
export type PromptsByCategory = {
  dua: Prompt[]
  perspectives: Prompt[]
  remedies: Prompt[]
  [key: string]: Prompt[]
}

// Define a type for the prompts organized by language
export type PromptsByLanguage = {
  [key: string]: PromptsByCategory // e.g., 'en': {dua: [...], perspectives: [...], remedies: [...]}, 'ar': {...}, etc.
}

// This function simulates fetching prompts based on the current language
const fetchPromptsForLanguage = async (language: string): Promise<PromptsByCategory> => {
  // Mock data structure for demonstration. Replace with your actual data source.
  const data: PromptsByLanguage = {
    ar: arPrompts,
    bs: bsPrompts,
    en: enPrompts,
    fr: frPrompts,
    id: idPrompts,
    tml: tmlPrompts,
    tur: turPrompts,
    ur: urPrompts,
  }

  const promptsByLanguage = data[language] || data.en // Default to English if language not found

  // Initialize an empty object to store one random prompt per category
  const randomPrompts: PromptsByCategory = { dua: [], perspectives: [], remedies: [] }

  // Iterate over each category to select one random prompt
  Object.keys(promptsByLanguage).forEach((category) => {
    const prompts: Prompt[] = promptsByLanguage[category]
    const randomIndex = Math.floor(Math.random() * prompts.length)
    // Assign the randomly selected prompt to the corresponding category in the result object
    randomPrompts[category] = [prompts[randomIndex]] // Wrap in an array to match PromptsByCategory type
  })

  return randomPrompts
}

// Export the Prompt interface and the fetchPromptsForLanguage function as separate values
export default fetchPromptsForLanguage
