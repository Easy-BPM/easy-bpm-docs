import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Get started',
      items: [
        'getting-started/run-first-process',
        'getting-started/build-first-agent',
        'getting-started/build-human-tasks',
      ],
    },
    {
      type: 'category',
      label: 'Setup',
      items: [
        {
          type: 'category',
          label: 'For developers',
          items: ['getting-started/quick-start'],
        },
        {
          type: 'category',
          label: 'For administrators',
          items: [
            'getting-started/administrators',
            'getting-started/configuration',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Build processes',
      items: [
        'guides/create-process',
        'guides/forms',
        'guides/user-tasks',
        'guides/api-tasks',
        'guides/code-tasks',
        'guides/message-events',
        'guides/call-activities',
        'guides/documents',
      ],
    },
    {
      type: 'category',
      label: 'Platform apps',
      items: [
        'platform/modeler',
        'platform/task-portal',
        'platform/admin',
        'platform/operations',
      ],
    },
    {
      type: 'category',
      label: 'API reference',
      items: [
        'api/overview',
        'api/swagger',
        'api/authentication',
        'api/workspace-secrets',
        'api/agent-processes',
        'api/processes',
        'api/tasks',
        'api/forms',
        'api/documents',
        'api/code-tasks',
        'api/incidents',
        'api/admin-security',
        'api/admin-maintenance',
        'api/ai-credentials',
        'api/schemas',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/production-readiness',
        'deployment/kubernetes',
        'deployment/keycloak',
        'deployment/capacity-planning',
        'deployment/observability',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/releases',
        'reference/process-json',
        'reference/permissions',
        'reference/environment-variables',
        'reference/examples',
      ],
    },
  ],
};

export default sidebars;
