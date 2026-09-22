# Codex Agent: API Documentation Sync

When the Easy BPM backend API changes, update the public API documentation from the live Swagger/OpenAPI contract.

## Trigger

Run this workflow whenever a task mentions:

- Swagger UI
- OpenAPI
- new backend endpoint
- changed controller, DTO, request body, response body, or API permission
- API reference documentation

## Workflow

1. Start or connect to the Easy BPM backend that exposes the newest Swagger contract.
2. Run:

```bash
npm run api:sync -- --source http://localhost:8080/v3/api-docs
```

3. Review generated changes in:

- `static/openapi/easybpm-openapi.json`
- `docs/api/overview.md`
- `docs/api/schemas.md`
- the operation table in each `docs/api/*.md` group page

4. If a new endpoint needs explanation beyond the generated operation table, add a concise section with:

- purpose
- required permission, when known
- curl example
- request body example
- response example

5. Validate before finishing:

```bash
npm run typecheck
npm run build
```

## Check Mode

Use this in CI or before release to detect stale API docs:

```bash
npm run api:check -- --source http://localhost:8080/v3/api-docs
```

The check fails if the Swagger contract would change the generated API documentation.
