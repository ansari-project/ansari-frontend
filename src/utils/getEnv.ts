const envConfig = {
  API_URL: () => process.env.REACT_APP_API_URL!,
  LOADING_MESSAGE_RESPONSE_TIMEOUT: () =>
    process.env.REACT_APP_API_TIMEOUT ? Number.parseInt(process.env.REACT_APP_API_TIMEOUT) : 60000,
  IS_PRODUCTION: () => process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: () => process.env.NODE_ENV === 'development',
  FEEDBACK_EMAIL: () => process.env.REACT_APP_FEEDBACK_EMAIL,
  FEEDBACK_MAIL_TO: () => `mailto:${process.env.REACT_APP_FEEDBACK_EMAIL}`,
}

const getEnv = <T extends keyof typeof envConfig>(key: T) => {
  return envConfig[key]() as ReturnType<(typeof envConfig)[T]>
}

export default getEnv
