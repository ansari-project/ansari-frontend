const { getSentryExpoConfig } = require('@sentry/react-native/metro')
const { withNativeWind } = require('nativewind/metro')
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config')

const config = getSentryExpoConfig(__dirname)

const nativeWindConfig = withNativeWind(config, { input: './src/global.css' })

module.exports = wrapWithReanimatedMetroConfig(nativeWindConfig)
