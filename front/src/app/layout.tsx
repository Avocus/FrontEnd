import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../utils/theme-provider";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { AuthProvider } from "@/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avocuss",
  description: "Plataforma jurídica Avocuss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-auto`}
      >
        <ThemeProvider>
          <LayoutProvider>
            <AuthProvider>
              <div className="min-h-screen">
                {children}
              </div>
            </AuthProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
