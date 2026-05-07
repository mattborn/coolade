Audit coolade sync state. For each file below, diff the source (in this repo) against every deployed target (in config.json). Summarize what's missing, added, or changed in each direction.

## Files to audit

### RULES.md
Source of truth for coding rules. Synced to all `config.paths` targets.
- Diff RULES.md against each target
- Flag rules present in a target but missing from source (need to pull back)
- Flag rules present in source but missing from a target (need to sync)

### settings.json
Source of truth for shared Claude/Codex permissions. Merged into all `config.settings` targets.
- Diff `permissions.allow` — flag entries added or removed in either direction
- Diff `permissions.deny` — flag entries added or removed in either direction
- List any target keys NOT in source (device-specific keys like model, plugins, voice) — these are expected but should be called out so nothing shared is hiding in them

### ASK.md
Commands that must never appear in allow or deny. Cross-check against settings.json:
- For each `Bash(...)` entry, extract the command name (first word inside parens, e.g. `Bash(git push *)` → `git`)
- Match that command name exactly against ASK.md entries — not as a substring
- Flag any match found in `permissions.allow` (violation — remove it)
- Flag any match found in `permissions.deny` (violation — remove it, default prompt is correct)
- Flag any new command being proposed for allow/deny that matches

### config.json
Not synced anywhere — just verify all target paths are valid and reachable.

## Output format

For each file, report one of:
- **In sync** — no differences
- **Source behind** — target has changes to pull back into coolade
- **Target behind** — source has changes that haven't been synced yet
- **Diverged** — both sides have unique changes

Then list the specific differences.
