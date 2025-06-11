module.exports = {
  displayName: 'frontend',
  rootDir: '.',
  testMatch: ['<rootDir>/front/src/test/**/*.test.jsx'],
  moduleFileExtensions: ['js', 'jsx'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/front/__mocks__/fileMock.front.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
};