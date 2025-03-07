const envConfig = {
  API_URL: () => process.env.EXPO_PUBLIC_API_URL!,
  LOADING_MESSAGE_RESPONSE_TIMEOUT: () =>
    process.env.EXPO_PUBLIC_API_TIMEOUT ? Number.parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT) : 60000,
}

export const getEnv = <T extends keyof typeof envConfig>(key: T) => {
  return envConfig[key]() as ReturnType<(typeof envConfig)[T]>
}
