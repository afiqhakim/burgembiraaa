import type { Metadata } from "next";
import { Roboto, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "@/features/navigation/components/navbar";

const sourceSans3 = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-brand",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burgembiraaa",
  description:
    "Public and private page scaffold with RBAC-ready authorization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSans3.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="w-full flex-1 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
