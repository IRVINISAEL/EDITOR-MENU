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
  title: "Menu Master",
  description: "Crea y administra tus menús digitales fácilmente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;700&family=Lora&family=Raleway&family=Oswald&family=Merriweather&family=Poppins&family=EB+Garamond&family=Cinzel&family=Dancing+Script&family=Josefin+Sans&family=Libre+Baskerville&family=Bebas+Neue&family=Abril+Fatface&family=Quicksand&family=Cormorant+Garamond&family=Nunito&family=Pacifico&family=Crimson+Text&family=Rubik&family=Barlow+Condensed&family=Space+Grotesk&family=DM+Serif+Display&family=Fjalla+One&family=Prata&family=Caveat&family=Marcellus&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Lora&family=Raleway&family=Oswald&family=Merriweather&family=Poppins&family=EB+Garamond&family=Cinzel&family=Dancing+Script&family=Josefin+Sans&family=Libre+Baskerville&display=swap" rel="stylesheet" />
  </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
