// eslint-config-next 16 ships flat configs directly — no FlatCompat wrapper.
import next from 'eslint-config-next';
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'src/content/**', 'next-env.d.ts'] },

  ...[next, coreWebVitals, typescript].flat(),

  {
    rules: {
      // `const { content: _omit, ...summary } = post` is the idiomatic way to
      // drop a key; the binding is intentionally unused.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },

  {
    // tailwind.config.js is CommonJS by design — Tailwind 3 loads it with require().
    files: ['tailwind.config.js', 'postcss.config.mjs'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
];

export default config;
