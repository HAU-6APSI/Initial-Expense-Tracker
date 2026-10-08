# Security Policy

## Supported versions

This project is currently under active development. Security fixes are applied to the latest repository state.

## Reporting a vulnerability

Do not open a public GitHub issue for a suspected security vulnerability. Send the report privately to the repository maintainer.

Include:

- A description of the vulnerability
- Steps to reproduce it
- Affected version or branch
- Potential impact
- Suggested mitigation, if available

Do not share credentials, database connection strings, tokens, or live user data in the report.

## Security expectations

- Keep secrets out of source control.
- Use environment variables for deployment configuration.
- Avoid deploying with local-memory mode enabled.
- Validate input and database permissions before exposing new APIs.
- Review dependencies and security advisories before release.

## Safe configuration

Use the `.env.example` file as a template. Copy it to `.env` locally, replace the placeholder values, and ensure the completed file remains ignored by Git.
