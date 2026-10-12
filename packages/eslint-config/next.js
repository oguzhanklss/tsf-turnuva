import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

/** Shared ESLint rules for the Next.js apps in this repo; mirrors tsf-web. */
export default [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // The design system styles plain <img> elements directly.
      '@next/next/no-img-element': 'off',
    },
  },
  { ignores: ['.next/**', 'node_modules/**'] },
];
