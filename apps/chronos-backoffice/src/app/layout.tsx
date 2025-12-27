import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "./providers";

export const metadata: Metadata = {
  title: "Chronos Backoffice",
  description: "Extensão cognitiva para gestão temporal e de recursos."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
