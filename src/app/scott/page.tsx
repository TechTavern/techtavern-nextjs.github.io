import type { Metadata } from 'next';
import RedirectClient from './RedirectClient';

// Server-side redirects() in next.config are ignored under output: "export",
// so this static page performs the /scott vanity redirect client-side.
const DESTINATION = '/consulting/scott-turnbull/';

export const metadata: Metadata = {
  title: 'Redirecting…',
  robots: { index: false, follow: false },
};

export default function ScottRedirectPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-light">
      <RedirectClient to={DESTINATION} />
      <p className="text-dark/80">
        Redirecting to{' '}
        <a href={DESTINATION} className="text-accent underline">
          Scott Turnbull&rsquo;s consulting profile
        </a>
        &hellip;
      </p>
    </main>
  );
}
