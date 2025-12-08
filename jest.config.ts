import type {Config} from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    testMatch: [
        '<rootDir>/tests/**/*.test.ts',
        '<rootDir>/tests/**/*.spec.ts',
        '<rootDir>/src/**/*.test.ts',
        '<rootDir>/src/**/*.spec.ts'
    ],
    moduleFileExtensions: ['ts', 'js', 'json'],
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    moduleNameMapper: {
        '^@domain/(.*)$': '<rootDir>/src/Domain/$1',
        '^@application/(.*)$': '<rootDir>/src/Application/$1',
        '^@infrastructure/(.*)$': '<rootDir>/src/Infrastructure/$1',
        '^@presentation/(.*)$': '<rootDir>/src/Presentation/$1',
        '^@shared/(.*)$': '<rootDir>/src/Shared/$1',
        '^@core/(.*)$': '<rootDir>/src/Core/$1',
        '^@utils/(.*)$': '<rootDir>/src/Utils/$1',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    verbose: true,
    transform: {
        '^.+\\.ts$': 'ts-jest'
    }
};

export default config;