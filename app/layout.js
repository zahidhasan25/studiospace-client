import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "StudioSpace — Creative Workspace & Production Studio Sharing",
  description: "Discover and book photography studios, film stages, podcast lounges, music suites and art workshops from verified creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
