module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/ui/$1',
    '^~/(.*)$': '<rootDir>/ui/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  'collectCoverage': true,
  'collectCoverageFrom': [
    '<rootDir>/ui/components/**/*.vue',
    '<rootDir>/ui/pages/**/*.vue'
  ],
  setupFilesAfterEnv: ['<rootDir>/ui/test/bootstrap.js'],
}
