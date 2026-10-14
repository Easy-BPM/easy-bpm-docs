import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

export default function Guides(): ReactNode {
  return (
    <Layout title="Guides" description="Easy BPM guides">
      <main className="container margin-vert--lg">
        <Heading as="h1">Guides</Heading>
      </main>
    </Layout>
  );
}
