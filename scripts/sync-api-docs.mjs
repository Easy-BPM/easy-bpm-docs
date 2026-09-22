#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const source = getArg('--source', process.env.EASYBPM_OPENAPI_SOURCE || 'http://localhost:8080/v3/api-docs');
const checkOnly = args.includes('--check');

const staticOpenApiPath = path.join(repoRoot, 'static/openapi/easybpm-openapi.json');
const overviewPath = path.join(repoRoot, 'docs/api/overview.md');
const schemasPath = path.join(repoRoot, 'docs/api/schemas.md');

const apiPages = {
  Authentication: path.join(repoRoot, 'docs/api/authentication.md'),
  'Agent Processes': path.join(repoRoot, 'docs/api/agent-processes.md'),
  Processes: path.join(repoRoot, 'docs/api/processes.md'),
  Tasks: path.join(repoRoot, 'docs/api/tasks.md'),
  Forms: path.join(repoRoot, 'docs/api/forms.md'),
  Documents: path.join(repoRoot, 'docs/api/documents.md'),
  'Code Tasks': path.join(repoRoot, 'docs/api/code-tasks.md'),
  Incidents: path.join(repoRoot, 'docs/api/incidents.md'),
  'Admin Security': path.join(repoRoot, 'docs/api/admin-security.md'),
  'Admin Maintenance': path.join(repoRoot, 'docs/api/admin-maintenance.md'),
  'Workspace Secrets': path.join(repoRoot, 'docs/api/workspace-secrets.md'),
  'AI Credentials': path.join(repoRoot, 'docs/api/ai-credentials.md'),
};

const groupOrder = Object.keys(apiPages);

const readOpenApi = async () => {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${source}: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  const sourcePath = path.resolve(repoRoot, source);
  return JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
};

const pageForTag = (tag) => {
  if (tag === 'Processes') return ['Processes', './processes'];
  if (tag === 'Tasks') return ['Tasks', './tasks'];
  if (tag === 'Forms') return ['Forms', './forms'];
  if (tag === 'Documents') return ['Documents', './documents'];
  if (tag === 'Incidents') return ['Incidents', './incidents'];
  if (tag === 'Admin Maintenance') return ['Admin Maintenance', './admin-maintenance'];
  if (tag === 'Agent Processes') return ['Agent Processes', './agent-processes'];
  if (tag === 'admin-security-controller') return ['Admin Security', './admin-security'];
  if (tag === 'admin-secret-controller') return ['Workspace Secrets', './workspace-secrets'];
  if (tag === 'ai-credential-controller') return ['AI Credentials', './ai-credentials'];
  if (tag === 'auth-controller') return ['Authentication', './authentication'];
  if (tag === 'user-controller') return ['Authentication', './authentication'];
  if (tag === 'code-task-controller') return ['Code Tasks', './code-tasks'];
  return [tag || 'Other', './swagger'];
};

const schemaName = (schema) => {
  if (!schema) return '-';
  if (schema.$ref) return schema.$ref.split('/').pop();
  if (schema.type === 'array') {
    const inner = schema.items?.$ref ? schema.items.$ref.split('/').pop() : schema.items?.type || 'object';
    return `${inner}[]`;
  }
  if (schema.type === 'object') return 'object';
  if (schema.type) return schema.format ? `${schema.type}(${schema.format})` : schema.type;
  return 'object';
};

const linkSchema = (name) => {
  if (!name || name === '-') return '-';
  if (name.endsWith('[]')) {
    const base = name.slice(0, -2);
    return `[${base}](./schemas)[]`;
  }
  if (/^[A-Z][A-Za-z0-9_]+$/.test(name)) return `[${name}](./schemas)`;
  return `\`${name}\``;
};

const requestDto = (op) => {
  const content = op.requestBody?.content || {};
  const media = content['application/json'] || content['multipart/form-data'] || content['application/xml'] || Object.values(content)[0];
  if (!media) return '-';
  return linkSchema(schemaName(media.schema));
};

const responseDto = (op) => {
  const res = op.responses?.['200'] || op.responses?.['201'] || Object.values(op.responses || {})[0];
  const content = res?.content || {};
  const media = content['application/json'] || content['*/*'] || content['application/octet-stream'] || Object.values(content)[0];
  if (!media) return '`No body`';
  if (content['application/octet-stream']) return '`binary file`';
  return linkSchema(schemaName(media.schema));
};

const endpointRows = (api) => {
  const rows = [];
  for (const [endpointPath, ops] of Object.entries(api.paths || {})) {
    for (const [method, op] of Object.entries(ops)) {
      const [group, page] = pageForTag(op.tags?.[0]);
      rows.push({
        method: method.toUpperCase(),
        path: endpointPath,
        operation: op.summary || op.operationId || `${method.toUpperCase()} ${endpointPath}`,
        operationId: op.operationId || '',
        group,
        page,
        request: requestDto(op),
        response: responseDto(op),
      });
    }
  }
  return rows.sort(
    (a, b) =>
      groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) ||
      a.path.localeCompare(b.path) ||
      a.method.localeCompare(b.method),
  );
};

const renderOverview = (api, rows) => {
  const counts = new Map();
  for (const row of rows) counts.set(`${row.group}|${row.page}`, (counts.get(`${row.group}|${row.page}`) || 0) + 1);
  const groupRows = [...counts.entries()]
    .map(([key, count]) => {
      const [group, page] = key.split('|');
      return {group, page, count};
    })
    .sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));

  let md = `---\ntitle: API Overview\n---\n\n# API Overview\n\nThis API reference is synchronized with the backend OpenAPI contract exposed at \`/v3/api-docs\`. The same contract powers Swagger UI at \`/swagger-ui.html\`.\n\n## Base URL\n\nLocal development:\n\n\`\`\`text\nhttp://localhost:8080\n\`\`\`\n\nCustomer environments should replace this with the HTTPS API origin for that deployment.\n\n## Authentication\n\nMost product endpoints require a JWT bearer token. Sign in with \`POST /auth/login\` and send the returned token as:\n\n\`\`\`http\nAuthorization: Bearer <token>\n\`\`\`\n\nOIDC-enabled environments can inspect the active sign-in provider with \`GET /auth/config\`.\n\n## Interactive API tools\n\n| Resource | URL |\n| --- | --- |\n| Swagger UI | \`/swagger-ui.html\` |\n| OpenAPI JSON | \`/v3/api-docs\` |\n| Static OpenAPI copy in this docs site | [Download JSON](/openapi/easybpm-openapi.json) |\n\n## API groups\n\n| Group | Operations | Page |\n| --- | ---: | --- |\n`;
  for (const group of groupRows) {
    md += `| ${group.group} | ${group.count} | [${group.group} API](${group.page}) |\n`;
  }
  md += `\n## Endpoint index\n\n| Method | Path | Operation | Request DTO | Response DTO | Group |\n| --- | --- | --- | --- | --- | --- |\n`;
  for (const row of rows) {
    md += `| \`${row.method}\` | \`${row.path}\` | [${row.operation}](${row.page}) | ${row.request} | ${row.response} | [${row.group} API](${row.page}) |\n`;
  }
  return md;
};

const typeOf = (schema) => {
  if (!schema) return 'object';
  if (schema.$ref) return schema.$ref.split('/').pop();
  if (schema.type === 'array') return `${typeOf(schema.items)}[]`;
  if (schema.type === 'object' && schema.additionalProperties) return `Map<String, ${typeOf(schema.additionalProperties)}>`;
  if (schema.type) return schema.format ? `${schema.type}(${schema.format})` : schema.type;
  if (schema.oneOf) return schema.oneOf.map(typeOf).join(' | ');
  return 'object';
};

const renderSchemas = (api) => {
  const schemas = api.components?.schemas || {};
  let md = `---\ntitle: Schemas\n---\n\n# Schemas\n\nThese schemas are generated from the current backend OpenAPI components. Fields marked required come from the OpenAPI \`required\` array.\n`;
  for (const [name, schema] of Object.entries(schemas).sort(([a], [b]) => a.localeCompare(b))) {
    md += `\n## ${name}\n\n`;
    if (schema.description) md += `${schema.description}\n\n`;
    const props = schema.properties || {};
    const required = new Set(schema.required || []);
    if (!Object.keys(props).length) {
      md += `| Type | Description |\n| --- | --- |\n| \`${typeOf(schema)}\` | ${(schema.description || '').replace(/\|/g, '\\|')} |\n`;
      continue;
    }
    md += `| Property | Type | Required | Description |\n| --- | --- | --- | --- |\n`;
    for (const [prop, propSchema] of Object.entries(props)) {
      const description = (propSchema.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
      md += `| \`${prop}\` | \`${typeOf(propSchema)}\` | ${required.has(prop) ? 'Yes' : 'No'} | ${description} |\n`;
    }
  }
  return md;
};

const renderOperationsTable = (rows) => {
  let md = `| Method | Path | Summary |\n| --- | --- | --- |\n`;
  for (const row of rows) {
    md += `| \`${row.method}\` | \`${row.path}\` | ${row.operation} |\n`;
  }
  return md.trimEnd();
};

const replaceOperationsTable = (filePath, table) => {
  if (!fs.existsSync(filePath)) return null;
  const original = fs.readFileSync(filePath, 'utf8');
  const marker = '## Operations';
  const markerIndex = original.indexOf(marker);
  if (markerIndex < 0) return null;
  const afterMarker = markerIndex + marker.length;
  const nextSection = original.indexOf('\n## ', afterMarker);
  if (nextSection < 0) return null;
  return `${original.slice(0, afterMarker)}\n\n${table}\n${original.slice(nextSection)}`;
};

const writeIfChanged = (filePath, content, changed) => {
  const previous = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (previous !== content) changed.push(path.relative(repoRoot, filePath));
  if (!checkOnly) fs.writeFileSync(filePath, content);
};

const main = async () => {
  const api = await readOpenApi();
  const rows = endpointRows(api);
  const changed = [];

  writeIfChanged(staticOpenApiPath, `${JSON.stringify(api, null, 2)}\n`, changed);
  writeIfChanged(overviewPath, renderOverview(api, rows), changed);
  writeIfChanged(schemasPath, renderSchemas(api), changed);

  for (const group of groupOrder) {
    const groupRows = rows.filter((row) => row.group === group);
    const nextContent = replaceOperationsTable(apiPages[group], renderOperationsTable(groupRows));
    if (nextContent) writeIfChanged(apiPages[group], nextContent, changed);
  }

  if (checkOnly && changed.length > 0) {
    console.error('API docs are out of sync:');
    for (const file of changed) console.error(`- ${file}`);
    process.exit(1);
  }

  console.log(`Synchronized ${rows.length} API operations from ${source}.`);
  if (changed.length > 0) {
    console.log(checkOnly ? 'Files that would change:' : 'Updated files:');
    for (const file of changed) console.log(`- ${file}`);
  } else {
    console.log('No API doc changes detected.');
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
