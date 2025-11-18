import { useFonts } from 'expo-font'
import { Inter_400Regular } from '@expo-google-fonts/inter'
import { Exo2_400Regular, Exo2_600SemiBold, Exo2_700Bold, Exo2_700Bold_Italic } from '@expo-google-fonts/exo-2'

type CustomFonts = {
  [fontName: string]: string | number
}

export const useCustomFonts = () => {
  const customFonts: CustomFonts = {
    // Google Fonts
    Inter: Inter_400Regular,
    Exo2: Exo2_400Regular,
    'Exo2-SemiBold': Exo2_600SemiBold,
    'Exo2-Bold': Exo2_700Bold,
    'Exo2-Bold-Italic': Exo2_700Bold_Italic,
  }

  const [fontsLoaded, fontError] = useFonts(customFonts)

  return {
    fontsLoaded,
    fontError,
  }
}

export default useCustomFonts
