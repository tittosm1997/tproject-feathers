import globals from 'globals';
import pluginJs from '@eslint/js';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      // Custom rules for your project
      'semi': ['error', 'always'],   // Enforce semicolons at the end of statements
      'quotes': ['error', 'single'], // Enforce single quotes for strings
    }
  },
  pluginJs.configs.recommended,
];