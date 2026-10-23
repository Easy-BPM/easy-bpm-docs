import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  getStarted: [
    'intro',
    {
      type: 'category',
      label: 'Get Started',
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
  ],
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'introduction/process',
        'introduction/process-instances',
        'introduction/human-tasks',
        'introduction/automated-tasks',
        'introduction/messages',
        'introduction/events',
        'introduction/gateways',
        'introduction/conditions',
        'introduction/variables',
        'introduction/forms',
        'introduction/documents',
        'introduction/subprocesses',
        'introduction/access-management',
        'introduction/incidents',
        'introduction/code-tasks',
        'introduction/process-design',
      ],
    },
    {
      type: 'category',
      label: 'Modeler',
      items: [
        {
          type: 'doc',
          id: 'platform/modeler',
          label: 'Components',
        },
        {
          type: 'doc',
          id: 'platform/form-modeler',
          label: 'Forms',
        },
        {
          type: 'doc',
          id: 'platform/decision-modeler',
          label: 'DMN Decision Tables',
        },
        {
          type: 'doc',
          id: 'platform/agent-modeler',
          label: 'Agents',
        },
      ],
    },
    {
      type: 'category',
      label: 'Platform Apps',
      items: [
        'platform/task-portal',
        'platform/admin',
        'platform/operations',
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
        'reference/permissions',
        'reference/environment-variables',
      ],
    },
  ],
  api: [
    'api/overview',
    'api/swagger',
    'api/authentication',
    'api/api-clients',
    'api/sla',
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
    'api/schemas',
  ],
};

export default sidebars;
