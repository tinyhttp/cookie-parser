import ts from '@rollup/plugin-typescript'
import json from './package.json' assert { type: "json" }

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'esm'
    }
  ],
  plugins: [ts()],
  external: [...Object.keys(json.dependencies)]
}
