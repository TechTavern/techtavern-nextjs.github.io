import type { ReactNode } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export const metadata = {
  title: {
    template: "%s | Tech Tavern Consulting",
    default: "Consulting | Tech Tavern",
  },
  description: "Book strategic AI and cloud consulting sessions with the Tech Tavern team.",
};

interface ConsultingLayoutProps {
  children: ReactNode;
}

export default function ConsultingLayout({ children }: ConsultingLayoutProps) {
  return (
    <>
      <Header variant="interior" />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-light">{children}</main>
      <Footer />
    </>
  );
}
