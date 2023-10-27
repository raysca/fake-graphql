module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    "testPathIgnorePatterns": [
      "<rootDir>/.next/",
      "<rootDir>/node_modules/",
      "<rootDir>/out/",
      "<rootDir>/public/",
      "<rootDir>/docs/",
      "<rootDir>/lib/"
    ]
  }
  