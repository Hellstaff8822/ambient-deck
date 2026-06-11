import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";

const pixelFont = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Ambient Deck",
  description: "Retro pomodoro and ambient station",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="h-full bg-[#090611]">
      <body
        className={`${pixelFont.variable} font-[family-name:var(--font-pixel)] antialiased bg-[#090611] text-slate-200 h-full overflow-hidden`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
