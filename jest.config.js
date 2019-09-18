module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: "jsdom",
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/ui/$1',
    '^~/(.*)$': '<rootDir>/ui/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transformIgnorePatterns: ["/node_modules/(?!(vuetify)/)"],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  'collectCoverage': true,
  'collectCoverageFrom': [
    '<rootDir>/ui/components/**/*.vue',
    '<rootDir>/ui/pages/**/*.vue'
  ],
  snapshotSerializers: ['jest-serializer-vue'],
  setupFilesAfterEnv: ['<rootDir>/ui/test/bootstrap.js'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      diagnostics: false
    },
    NODE_ENV: 'test'
  }
};
