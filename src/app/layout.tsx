import "./globals.css";
import type { ReactNode } from "react";
import Navigation from "@/components/ui/Navigation";
import { getBaseUrl } from "@/lib/site";

export const metadata = {
  title: "Tech Tavern - Technology Solutions & Cybersecurity",
  description: "Empowering businesses through innovative technology solutions, cybersecurity expertise, and strategic IT leadership.",
  keywords: "technology consulting, cybersecurity, IT solutions, software development, DevOps",
  // Helps Next.js resolve relative metadata URLs to absolute
  metadataBase: new URL(getBaseUrl()),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          httpEquiv="Content-Security-Policy"
          content={`default-src 'self'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}; img-src 'self'; font-src 'self'; style-src 'self' 'unsafe-inline';`}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
