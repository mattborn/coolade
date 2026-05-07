#!/usr/bin/env node
const { readFile, writeFile, mkdir } = require('node:fs/promises')
const { join, dirname } = require('node:path')
const { homedir } = require('node:os')

const expand = path =>
  path.startsWith('~/') ? join(homedir(), path.slice(2)) : path

;(async () => {
  const base = __dirname
  const config = JSON.parse(await readFile(join(base, 'config.json'), 'utf8'))
  const rules = await readFile(join(base, 'RULES.md'))

  // Copy RULES.md to each path
  await Promise.all(
    (config.paths || []).map(async target => {
      const dest = expand(target)
      await mkdir(dirname(dest), { recursive: true })
      await writeFile(dest, rules)
      console.log(`RULES.md → ${dest}`)
    }),
  )

  // Merge settings.json into each target (preserves device-specific keys)
  if (config.settings?.length) {
    const shared = JSON.parse(await readFile(join(base, 'settings.json'), 'utf8'))
    await Promise.all(
      config.settings.map(async target => {
        const dest = expand(target)
        await mkdir(dirname(dest), { recursive: true })
        const existing = JSON.parse(await readFile(dest, 'utf8').catch(() => '{}'))
        await writeFile(dest, JSON.stringify({ ...existing, ...shared }, null, 2))
        console.log(`settings.json → ${dest}`)
      }),
    )
  }
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
