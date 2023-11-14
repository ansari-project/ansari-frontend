const envConfig = {
  API_URL: () => process.env.REACT_APP_API_URL!,
  LOADING_MESSAGE_RESPONSE_TIMEOUT: () => (process.env.REACT_APP_API_TIMEOUT ? Number.parseInt(process.env.REACT_APP_API_TIMEOUT) : 60000),
  isProduction: () => process.env.NODE_ENV === 'production',
  isDevelopment: () => process.env.NODE_ENV === 'development',
}

export const getEnv = <T extends keyof typeof envConfig>(key: T) => {
  return envConfig[key]() as ReturnType<(typeof envConfig)[T]>
}
