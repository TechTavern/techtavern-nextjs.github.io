import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container mx-auto max-w-3xl p-6 text-center">
      <h1 className="text-4xl font-heading font-bold text-dark">Page Not Found</h1>
      <p className="mt-4 text-dark/70">
        We couldn&rsquo;t locate the page you requested. If you were trying to view an article page,
        the content may have moved or the page number may be out of range.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4">
        <Link
          href="/articles/"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-light shadow-lg transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:outline-none"
        >
          Browse Articles
        </Link>
        <Link
          href="/"
          className="text-primary underline-offset-4 transition hover:underline"
        >
          Return to homepage
        </Link>
      </div>
    </main>
  );
}
