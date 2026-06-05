import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BlogHub - Premium Tech Blog",
  description: "A premium full-stack blogging platform with a modern design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="container" style={{ padding: "2rem 0" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
