import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-Assisted Security Research Tool",
  description: "Analyze HTTP traffic and security findings with AI assistance.",
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
