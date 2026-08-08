import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Highland PM Operations Desk",
  description:
    "Highland Construction dashboard for projects, safety, financial controls, integrations, and protected administration.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
