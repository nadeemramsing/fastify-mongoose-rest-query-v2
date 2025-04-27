import { readFile } from 'fs/promises'
import { build } from 'esbuild'
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions'

const pkgRaw = await readFile(new URL('./package.json', import.meta.url), 'utf8')
const pkg = JSON.parse(pkgRaw)

const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
]

build({
  entryPoints: ['src/**/*'], // Change if your entry is different
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true,
  external: externals,
  plugins: [esbuildPluginFilePathExtensions({ esmExtension: 'js' })],
}).catch(() => process.exit(1))
