import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admira Abogados | Aziza Maghni – Abogada en Madrid",
  description:
    "Despacho de abogados especializado en extranjería, derecho de familia, laboral, mercantil y más. Hablamos árabe, francés e inglés. Puerta del Sol, Madrid.",
  keywords:
    "abogados Madrid, abogada árabe Madrid, extranjería, divorcio express, derecho laboral, Admira Abogados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
