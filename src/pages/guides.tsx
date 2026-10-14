import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

export default function Guides(): ReactNode {
  return (
    <Layout title="Guides" description="Easy BPM guides">
      <main className="container margin-vert--lg">
        <Heading as="h1">Guides</Heading>
        <Heading as="h2">Under construction</Heading>
        <p>We’re preparing new guides. Check back soon.</p>
      </main>
    </Layout>
  );
}
