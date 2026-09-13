<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Expo documentation reference

- Use [docs/expo-llms.txt](docs/expo-llms.txt), the Expo documentation index provided for this project, to find relevant guidance before implementing or changing Expo features.
- Search the index for the current task and read the relevant linked pages. The index contains links and short descriptions, not the full documentation.
- For links containing `/versions/latest/`, use the equivalent `/versions/v57.0.0/` page and verify the API against this project's installed packages. Do not assume an API listed in the index is available in SDK 57.
- Keep unversioned guide links as written. If guidance conflicts, the SDK 57 documentation and installed package interfaces take precedence over this saved index.
- Use the installed Expo skills relevant to the task, starting with `expo-overview`.
