const { readFile } = require('fs/promises')
const { build } = require('esbuild')
const path = require('path')

async function run() {
  const pkgRaw = await readFile(
    path.join(__dirname, 'package.json'),
    'utf8'
  )
  const pkg = JSON.parse(pkgRaw)

  const externals = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]

  build({
    entryPoints: ['src/**/*'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    sourcemap: true,
    external: externals,
  }).catch(() => process.exit(1))
}

run()
