Build the project, verify success, then commit all changes and push to main for automatic deployment via CI/CD.

Steps:

1. Run `pnpm check` and `pnpm build` and verify they succeed
2. Show `git status` and `git diff` to review changes
3. Create a commit with a concise English imperative-mood message
4. Push to main (GitHub Actions runs checks + E2E, then deploys)
5. Report the commit hash and that deploy has been triggered
