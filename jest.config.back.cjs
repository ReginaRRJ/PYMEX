module.exports = {
  displayName: 'backend',
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.test.js', '<rootDir>/test/**/*.test.cjs', '<rootDir>/test/**/*.test.mjs'],
  moduleFileExtensions: ['js', 'cjs', 'mjs'],  // ← agrega aquí también
  testEnvironment: 'node',
  transform: {},
};