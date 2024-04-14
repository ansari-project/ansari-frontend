const envConfig = {
  API_URL: () => process.env.REACT_APP_API_V2_URL!,
  SHARE_URL: () => process.env.REACT_APP_SHARE_URL!,
  LOADING_MESSAGE_RESPONSE_TIMEOUT: () =>
    process.env.REACT_APP_API_TIMEOUT ? Number.parseInt(process.env.REACT_APP_API_TIMEOUT) : 60000,
  IS_PRODUCTION: () => process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: () => process.env.NODE_ENV === 'development',
  FEEDBACK_EMAIL: () => process.env.REACT_APP_FEEDBACK_EMAIL,
  FEEDBACK_MAIL_TO: () => `mailto:${process.env.REACT_APP_FEEDBACK_EMAIL}`,
  COMPREHENSIVE_GUIDE_URL: () => process.env.REACT_APP_COMPREHENSIVE_GUIDE_URL!,
  PRIVACY_URL: () => process.env.REACT_APP_PRIVACY_URL!,
  TERMS_URL: () => process.env.REACT_APP_TERMS_URL!,
  SUBSCRIBE_URL: () => process.env.REACT_APP_SUBSCRIBE_URL!,
  ENABLE_SHARE: () => process.env.REACT_APP_ENABLE_SHARE === 'true',
}

const getEnv = <T extends keyof typeof envConfig>(key: T) => {
  return envConfig[key]() as ReturnType<(typeof envConfig)[T]>
}

export default getEnv
