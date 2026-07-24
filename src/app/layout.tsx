import type { Metadata } from "next";
import { Providers } from "@/components/common/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Portfolio - Build Your Dream Portfolio with AI",
  description:
    "Create stunning, personalized portfolio websites in minutes with AI. Perfect for developers, designers, and creative professionals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
