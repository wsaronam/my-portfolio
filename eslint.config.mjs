// one ESLint config for the whole monorepo (both apps)
import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'




export default defineConfig([
    // An `eslint-disable` comment that no longer hides anything is itself an error.
    { linterOptions: { reportUnusedDisableDirectives: 'error' } },

    // Generated files are never linted.
    globalIgnores(['**/dist/', '**/coverage/', 'apps/api/drizzle/']),

    // ---- All TypeScript: type-aware rules -------------------------------------
    {
        files: ['**/*.{ts,tsx}'],
        extends: [js.configs.recommended, tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
        languageOptions: {
            parserOptions: {
                // Lets rules use TypeScript's type information (finds each file's tsconfig).
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Security: never turn strings into code.
            'no-eval': 'error',
            'no-new-func': 'error',
            'no-script-url': 'error',

            // Correctness
            eqeqeq: ['error', 'always'],
            'no-console': ['warn', { allow: ['warn', 'error'] }],

            // ---- Adjusted to how this project's libraries are meant to be used ----
            // React Router: loaders and actions `throw redirect(...)` / `throw data(...)`.
            '@typescript-eslint/only-throw-error': [
                'error',
                {
                    allow: [
                        { from: 'lib', name: 'Response' },
                        { from: 'package', package: 'react-router', name: 'DataWithResponseInit' },
                    ],
                },
            ],
        // Fastify plugins and hooks must be async functions even when they don't await anything.
        '@typescript-eslint/require-await': 'off',
        // What may appear inside `${...}` in a template string. Options you leave out fall back
        // to the rule's lenient defaults (not the strict preset's), so all are listed.
        '@typescript-eslint/restrict-template-expressions': [
            'error',
            {
                allowNumber: true, // `Page ${page} of ${total}`
                allowNullish: true, // CSS Modules: `container ${styles.inner}` is typed string | undefined
                allowAny: false,
                allowBoolean: false,
                allowRegExp: false,
                allowNever: false,
            },
        ],
        // React's `onChange={(e) => setValue(e.target.value)}` is idiomatic.
        '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
        // Our convention: `type` for every object shape (it also works for unions).
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        },
    },

    // ---- The React app (runs in the browser) ----------------------------------
    {
        files: ['apps/web/**/*.{ts,tsx}'],
        extends: [reactHooks.configs.flat['recommended-latest'], reactRefresh.configs.vite],
        languageOptions: { globals: globals.browser },
    },

    // ---- The API and scripts (run in Node) ------------------------------------
    {
        files: ['apps/api/**/*.ts', 'apps/web/vite.config.ts'],
        languageOptions: { globals: globals.node },
    },

    // ---- Type declaration files -------------------------------------------------
    {
        // Adding fields to a library's types ("declaration merging") only works with `interface`.
        files: ['**/*.d.ts'],
        rules: { '@typescript-eslint/consistent-type-definitions': 'off' },
    },

    // ---- Command-line scripts print their results ------------------------------
    {
        files: ['apps/api/scripts/**/*.ts'],
        rules: { 'no-console': 'off' },
    },

    // ---- Tests ----------------------------------------------------------------
    {
        files: ['**/*.test.{ts,tsx}', 'apps/api/test/**/*.ts'],
        rules: {
            // response.json() is `any` by design; the assertions are what check its shape.
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
        },
    },

    // ---- Plain JavaScript config files: no type information -------------------
    {
        files: ['**/*.{js,mjs,cjs}'],
        extends: [js.configs.recommended, tseslint.configs.disableTypeChecked],
        languageOptions: { globals: globals.node },
    },
])