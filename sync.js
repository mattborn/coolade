#!/usr/bin/env node
const { readFile, writeFile, mkdir } = require('node:fs/promises')
const { join, dirname } = require('node:path')
const { homedir } = require('node:os')

const expand = path =>
  path.startsWith('~/') ? join(homedir(), path.slice(2)) : path

;(async () => {
  const base = __dirname
  const config = JSON.parse(
    await readFile(join(base, 'config.json'), 'utf8'),
  )
  const rules = await readFile(join(base, 'RULES.md'))
  await Promise.all(
    (config.paths || []).map(async target => {
      const dest = expand(target)
      await mkdir(dirname(dest), { recursive: true })
      await writeFile(dest, rules)
      console.log(`Copied RULES.md → ${dest}`)
    }),
  )
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
