## Project Agent Rules

### Always-On Skill
- For this repository (`/Users/manuel/Developer/personal/fall`), always apply the `frontend-hexagonal-bun` skill for any code-change task, in any thread.
- Treat this as the default behavior even if the user does not explicitly mention the skill.
- Only skip the skill for non-code tasks (for example: pure discussion, planning, issue/PR admin, or status checks).
- If the skill cannot be loaded, state that briefly and continue while following the same hexagonal architecture conventions.

### Skill Reference
- Skill file: `/Users/manuel/.codex/skills/frontend-hexagonal-bun/SKILL.md`
