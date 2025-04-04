// eslint.config.js
import { defineFlatConfig } from '@eslint/eslintrc'
import nextPlugin from '@next/eslint-plugin-next'

export default defineFlatConfig([{
        plugins: {
            '@next/next': nextPlugin
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn'
        }
    },
    {
        ignores: ['.next/', 'node_modules/']
    }
])