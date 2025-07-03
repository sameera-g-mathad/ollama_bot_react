'use client';

import { Page, Content } from './Components';
import './page.css';

/**
 * This is the main entry point of the application.
 * It renders the Page component with Content inside it.
 * The Page component includes a header, footer, and content area.
 * @returns A React component that displays the main page layout.
 */

export default function Home() {
  return (
    <Page>
      <Content />
    </Page>
  );
}
