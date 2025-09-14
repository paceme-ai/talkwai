// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/footer";
import "./globals.css";
import ConditionalHeader from "@/components/conditional-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TalkwAI — Helping businesses talk with AI",
  description:
    "TalkwAI helps small businesses stay open with AI receptionists, call handling, and automations 24/7. Never miss a lead again.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
