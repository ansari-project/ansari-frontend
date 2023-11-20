import { languageGreen } from 'assets'
import { Button, CustomFlowbiteTheme, Flowbite, Tooltip } from 'flowbite-react'
import i18n from 'i18n'
import { useState } from 'react'
const customTheme: CustomFlowbiteTheme = {
  tooltip: {
    style: {
      auto: 'bg-white w-52',
    },
  },
}

type LanguageObject = {
  [key: string]: {
    nativeName: string
  }
}
const languages: LanguageObject = {
  en: { nativeName: 'English' },
  ar: { nativeName: 'العربية' },
  ur: { nativeName: 'اردو' },
  tur: { nativeName: 'Türkçe' },
  bs: { nativeName: 'Bosanski' },
  id: { nativeName: 'Bahasa Indonesia' },
  fr: { nativeName: 'Français' },
}

const LanguageSelectorPopUp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedLanguageKey = i18n.language
  const reorderedLanguages = {
    [selectedLanguageKey]: languages[selectedLanguageKey],
    ...languages,
  }

  const handleLanguageChange = (language: string) => {
    setIsOpen(false)
    i18n.changeLanguage(language)
    localStorage.setItem('language', i18n.language)
    document.dir = i18n.dir(language)
  }

  return (
    <>
      <div className='md:hidden z-50 h-full'>
        <Flowbite theme={{ theme: customTheme }}>
          <Tooltip
            className={`${isOpen === true ? '' : 'invisible opacity-0'}`}
            style='auto'
            placement='bottom'
            content={
              <div className='flex flex-col z-50 landscape:h-40 overflow-y-auto'>
                {Object.keys(reorderedLanguages).map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => handleLanguageChange(langKey)}
                    className='my-3 py-1 text-green-bold font-semibold text-sm hover:text-orange cursor-pointer'
                  >
                    {languages[langKey].nativeName}
                  </button>
                ))}
              </div>
            }
            trigger='hover'
          >
            <Button color='primary' className='focus:ring-white' onClick={() => setIsOpen(true)}>
              <img src={languageGreen} alt='Language Icon' className=' w-5' />
            </Button>
          </Tooltip>
        </Flowbite>
      </div>
      <div className='hidden md:block'>
        <Flowbite theme={{ theme: customTheme }}>
          <Tooltip
            className={`${isOpen === true ? '' : 'invisible opacity-0'}`}
            style='auto'
            content={
              <div className='flex flex-col landscape:h-40 landscape:lg:h-auto overflow-y-auto'>
                {Object.keys(reorderedLanguages).map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => handleLanguageChange(langKey)}
                    className='z-50 my-3 text-green-bold hover:text-orange cursor-pointer'
                  >
                    {languages[langKey].nativeName}
                  </button>
                ))}
              </div>
            }
            trigger='hover'
          >
            <Button color='primary' className='focus:ring-background' onClick={() => setIsOpen(true)}>
              <img src={languageGreen} alt='Language Icon' className=' w-5' />
            </Button>
          </Tooltip>
        </Flowbite>
      </div>
    </>
  )
}

export default LanguageSelectorPopUp
