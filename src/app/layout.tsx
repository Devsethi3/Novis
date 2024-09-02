import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/provider/ThemeProvider";

const font = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Novis | Streamline your workflow through AI",
  description:
    "A Notion-inspired project built with Next.js, TypeScript, and Firebase",
  icons: {
    icon: "/logo.svg",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "shortcut icon",
      url: "/logo.svg",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={font.className}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
