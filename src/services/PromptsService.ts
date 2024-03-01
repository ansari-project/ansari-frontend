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
    ar: require('@endeavorpal/i18n/locales/ar/prompts.json'),
    bs: require('@endeavorpal/i18n/locales/bs/prompts.json'),
    en: require('@endeavorpal/i18n/locales/en/prompts.json'),
    fr: require('@endeavorpal/i18n/locales/fr/prompts.json'),
    id: require('@endeavorpal/i18n/locales/id/prompts.json'),
    tur: require('@endeavorpal/i18n/locales/tur/prompts.json'),
    ur: require('@endeavorpal/i18n/locales/ur/prompts.json'),
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
