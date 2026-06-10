import type { ReactNode } from "react";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

export const metadata = {
  title: {
    template: "%s | Tech Tavern Articles",
    default: "Articles | Tech Tavern",
  },
  description: "Insights and expertise on technology, cybersecurity, and IT solutions from Tech Tavern LLC.",
};

interface ArticlesLayoutProps {
  children: ReactNode;
}

export default function ArticlesLayout({ children }: ArticlesLayoutProps) {
  return (
    <>
      {/* Header Navigation (shared) */}
      <Header variant="interior" />

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-light">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
