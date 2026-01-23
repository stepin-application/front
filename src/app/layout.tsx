import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import Background from "@/components/ui/Background";
import DevNav from "@/components/DevNav";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "StepIn - One step closer",
  description: "StepIn est une plateforme de recrutement pour les étudiants et les entreprises. Elle permet aux entreprises de recruter des étudiants et aux étudiants de trouver des stages et des emplois.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen relative">
        <AuthProvider>
          <div className="absolute inset-0 -z-10" />
          <Header />
          <main className="pt-10 relative">
            <Background />
            <Toaster richColors />
            {children}
          </main>
          <DevNav/>
        </AuthProvider>
      </body>
    </html>
  );
}
