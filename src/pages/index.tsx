import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <p className={styles.kicker}>Easy BPM Documentation</p>
        <Heading as="h1" className={styles.heroTitle}>
          Build business processes your developers can ship and operate.
        </Heading>
        <p className={styles.heroSubtitle}>
          Run your first process, connect AI agents, build human tasks, and operate the workflow from model to production.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/next/getting-started/run-first-process">
            Run your first BPMN process
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/api/authentication">
            View API reference
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Documentation`}
      description="Public developer documentation for Easy BPM customers.">
      <HomepageHeader />
      <main className={styles.main}>
        <section className="container">
          <div className={styles.cardGrid}>
            <Link className={styles.card} to="/docs/guides/create-process">
              <h2>Model processes</h2>
              <p>Create start events, user tasks, API tasks, gateways, message events, timers, and subprocesses.</p>
            </Link>
            <Link className={styles.card} to="/docs/next/getting-started/build-first-agent">
              <h2>Integrate AI agents</h2>
              <p>Deploy reusable agent definitions, call them from BPM processes, and map AI outputs into variables.</p>
            </Link>
            <Link className={styles.card} to="/docs/next/getting-started/build-human-tasks">
              <h2>Orchestrate human tasks</h2>
              <p>Attach forms, assign people or groups, complete work in the Task Portal, and resume the process.</p>
            </Link>
            <Link className={styles.card} to="/docs/deployment/kubernetes">
              <h2>Deploy the stack</h2>
              <p>Run backend, worker, PostgreSQL, RabbitMQ, modeler, admin, and portal with Kubernetes or managed services.</p>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
