const { alias } = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias({
    '@endeavorpal': './src',
  })(config)

  return config
}
