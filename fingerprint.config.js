/** @type {import('@expo/fingerprint').Config} */
module.exports = {
  sourceSkips: ['ExpoConfigVersions'],
  fileHookTransform: (source, chunk) => {
    if (source.type === 'contents' && source.id === 'expoConfig' && typeof chunk === 'string') {
      try {
        const config = JSON.parse(chunk)
        // Exclude criticalIndex so bumping it doesn't change the fingerprint
        if (config.extra) {
          delete config.extra.criticalIndex
        }
        return JSON.stringify(config)
      } catch {
        return chunk
      }
    }
    return chunk
  },
}
