# AI Usage

This repository may be developed with AI assistance, but all changes must be reviewed before acceptance.

## Required review

- Verify every generated code change against the current source and tests.
- Run the relevant tests and build commands before considering a change complete.
- Never paste credentials, API keys, connection strings, or secret values into prompts or source files.
- Do not treat AI-generated SQL as executable without checking its constraints and permissions.
- Review generated documentation for accuracy and current repository commands.

## Allowed use

- Producing code, tests, documentation, and refactoring suggestions
- Explaining existing code and debugging implementation issues
- Generating migration or database setup scripts
- Supporting repository cleanup and review tasks

## Prohibited use

- Committing passwords, private keys, tokens, or real database credentials
- Using private repository data in public AI requests
- Deleting or overwriting user work without review
- Claiming that a feature works without running a verification command
- Bypassing security controls or deployment checks

## Verification standard

A completed AI-assisted change must include:

1. Relevant tests or a focused reproduction
2. A successful frontend production build
3. Backend validation when API behavior changed
4. A review of the final diff
5. Confirmation that no secrets were added
