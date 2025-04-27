import { build } from 'esbuild'
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions'

build({
  entryPoints: ['src/**/*'], // Change if your entry is different
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true,
  plugins: [esbuildPluginFilePathExtensions()],
}).catch(() => process.exit(1))
