module.exports = {
  testEnvironment: 'jest-allure2-reporter/environment-node',
  verbose: true,
  testTimeout: 90000,
  maxWorkers: 1,
  testMatch: ['**/*.spec.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js}'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  reporters: [
    'default',
    [
      'jest-allure2-reporter',
      {
        resultsDir: `./allure-results-${process.env.TEST_BROWSER || 'chrome'}`,
        attachments: {
          subDir: 'attachments',
          fileHandler: 'copy',
          contentHandler: 'write',
        },
        overwrite: true,
        injectGlobals: true,
      },
    ],
  ],
};
