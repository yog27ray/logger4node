// eslint-disable-next-line no-undef
module.exports = {
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true }]
  },
  clearMocks: true,
  verbose: false,
  reporters: [
    ['jest-simple-dot-reporter', { color: true }]
  ],
};
