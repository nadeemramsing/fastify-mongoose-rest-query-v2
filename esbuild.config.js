import { readFile } from 'fs/promises'
import { build } from 'esbuild'
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions'

const pkgRaw = await readFile(
  new URL('./package.json', import.meta.url),
  'utf8'
)
const pkg = JSON.parse(pkgRaw)

const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const addExtToLodashFPPlugin = {
  name: 'add-ext-to-lodash-fp-plugin',
  setup(build) {
    build.onResolve({ filter: /^lodash\/fp$/ }, (args) => ({
      path: 'lodash/fp.js',
      external: true,
    }))
  },
}

build({
  entryPoints: ['src/**/*'], // Change if your entry is different
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true,
  external: externals,
  plugins: [
    esbuildPluginFilePathExtensions({ esmExtension: 'js' }),
    addExtToLodashFPPlugin,
  ],
}).catch(() => process.exit(1))
