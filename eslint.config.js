import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['src/**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { 
            js 
        },
        rules: {
            'consistent-return': 'error',
            'quotes': ['error', 'single'],
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
        },
        extends: ['js/recommended'],
        languageOptions: { 
            globals: globals.node 
        },
    },
    {
        files: ['**/*.test.ts', '**/*.spec.ts', 'test/**/*'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        }
    },
    tseslint.configs.recommended,
])
