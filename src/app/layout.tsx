import type { Metadata } from "next";
import "../styles.css";


export const metadata: Metadata = {
  title: "Kgomotso Mathombo - Frontend & Mobile Developer",
  description:
    "Portfolio of Kgomotso Mathombo, a South African Frontend & Mobile App Developer building fast, accessible React and React Native experiences.",
  icons: {
    icon: "/favicon-k.svg",
    shortcut: "/favicon-k.svg",
    apple: "/favicon-k.svg",
  },
};

const themeScript = `
  (function () {
    try {
      var t = localStorage.getItem("theme");
      var d = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (d) document.documentElement.classList.add("dark");
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
