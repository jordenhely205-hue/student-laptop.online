import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Laptop Online - Laptop Scheme 2026",
  description: "Register now for the Student Laptop Scheme 2026. Online application for merit-based laptop distribution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="news-ticker">
          <div className="news-ticker-content">
            📢 Important Notice: Online Registration for Student Laptop Scheme 2026 is starting from 1st May. Last date to apply is 15th May. Apply as soon as possible!
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
