// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { createRequire } from 'node:module';

const externals = [
  'inversify',
  'reflect-metadata',
  'express',
  /^node:/,
];

export default [
  // ESM build (externalize uuid)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
    external: [...externals, 'uuid'],
    plugins: [
      typescript({ tsconfig: './tsconfig.rollup.json' }),
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
    ],
  },

// CJS build (bundle uuid)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external: externals, // intentionally NOT externalizing 'uuid'
    plugins: [
      typescript({ tsconfig: './tsconfig.rollup.json' }),
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
    ],
  },
];
