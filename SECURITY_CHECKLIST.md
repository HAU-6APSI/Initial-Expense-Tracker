# Security Checklist

## Before deployment

- [ ] Confirm that `DATABASE_URL` is set only in the deployment environment.
- [ ] Add `.env` and `.env.*` entries to `.gitignore` and verify Git does not report them.
- [ ] Never commit a password, direct connection string, private key, or API token.
- [ ] Run the SQL schema in Supabase using a least-privilege database role.
- [ ] Enable Row Level Security (RLS) for tables that contain user data.
- [ ] Add policy checks before all reads and writes when user-specific data is introduced.
- [ ] Validate that the backend rejects invalid amounts and malformed database values.
- [ ] Validate the API server does not expose stack traces or internal details in production responses.
- [ ] Validate that CORS is restricted to trusted deployments.
- [ ] Disable or remove local-memory fallback in production.
- [ ] Update the production environment configuration after deployment.
- [ ] Review the dependency tree for vulnerable packages.
- [ ] Confirm the repository has no secrets in Git history before publication.

## Recommended Supabase settings

- Use the Supabase Database password from the project settings.
- Use a separate production project instead of personal development data.
- Prefer port 5432 with SSL enabled.
- Restrict database access by IP or deployment environment where supported.
- Rotate database credentials after any suspected exposure.
- Keep RLS enabled and add explicit policies for each application role.

## Deployment verification

- [ ] Run `npm run build`.
- [ ] Run the backend tests.
- [ ] Test create, read, update, and delete operations against the deployed database.
- [ ] Verify the health endpoint reports the production database, not local mode.
- [ ] Confirm the frontend points to the deployed API URL, not localhost.
- [ ] Confirm no environment file is included in the deployed artifact.
- [ ] Inspect server logs for database or authentication failures.
