module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'js'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.{ts,js}']
};