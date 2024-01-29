import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

/**
 * Subscription Component
 *
 * This component is used to render a subscription link with internationalized text.
 * It uses the `Trans` component from `react-i18next` for language translation, ensuring
 * the component text changes according to the currently selected language.
 */
const Subscription: React.FC = () => {
  // Hook from react-i18next to access i18n instance
  // The i18n instance provides the current language information and translation functionality.
  // When the language changes, the useTranslation hook in the component will force this component to re-render itself.
  const { i18n } = useTranslation()

  return (
    // Link to the subscription URL, opens in a new tab for better user experience
    // `target="_blank"` opens the link in a new tab, and `rel="noopener noreferrer"`
    // is a security measure to prevent certain exploits when opening a new tab.
    <a
      href={process.env.REACT_APP_SUBSCRIBE_URL}
      target='_blank'
      rel='noopener noreferrer'
      style={{ textDecoration: 'none', color: 'black' }}
    >
      <span style={{ fontSize: 'small' }}>
        {/* The `Trans` component from `react-i18next` is used to render translated text.
            - `components` prop allows embedding React components within the translated text.
            - In this case, a span element with green color and underline is used for part of the text.
            - `i18nKey` is the key in the translation files that holds the text to be translated. */}
        <Trans
          components={{ 1: <span style={{ color: 'green', textDecoration: 'underline' }} /> }}
          i18nKey='subscribe'
          i18n={i18n}
        />
      </span>
    </a>
  )
}

export default Subscription
