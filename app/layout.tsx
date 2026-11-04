import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thanawat Ketiya — CSI205",
  description:
    "Resume of Thanawat Ketiya — CSI205 Front-End Software Development",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background-soft-50 font-sans text-foreground-soft-500">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
