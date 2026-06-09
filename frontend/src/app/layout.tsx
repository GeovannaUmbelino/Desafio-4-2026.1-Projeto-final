"use client";

import type { Metadata } from "next";
import { DataProvider } from "@/contexts/DataContext";
import "./globals.css";

// Metadata não funciona em client component, mas vamos manter
const metadata: Metadata = {
  title: "EngNet - Gestão de Frequência",
  description: "Sistema de gestão de presença para aulas práticas e laboratoriais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      'laranja': '#FF6B00',
                      'roxo': '#9B59B6'
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}