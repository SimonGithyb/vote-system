const env = process.env.NODE_ENV || 'development'

var config = {
  development: require('./config/development.js'),
}

module.exports = config[env]
