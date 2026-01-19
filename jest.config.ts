import type {Config} from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

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
        '<rootDir>/src/Test/Unit/**/*.test.ts',
        '<rootDir>/src/Test/Unit/**/*.spec.ts',
        '<rootDir>/src/Test/Integration/**/*.test.ts',
        '<rootDir>/src/Test/Integration/**/*.spec.ts'
    ],
    moduleFileExtensions: ['ts', 'js', 'json'],
    //roots: ['<rootDir>/src/Test/Unit'],
    roots: ['<rootDir>/src/Test/Unit', '<rootDir>/src/Test/Integration'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    verbose: true,
    transform: {
        '^.+\\.ts$': 'ts-jest'
    }
};

export default config;