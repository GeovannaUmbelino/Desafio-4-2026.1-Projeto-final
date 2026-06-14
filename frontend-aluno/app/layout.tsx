'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Notification from '@/components/Notification';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>EngNet - Área do Aluno</title>
        <meta name="description" content="Painel do aluno - Acompanhamento de frequência" />
        <script src="https://cdn.tailwindcss.com"></script>
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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex h-screen overflow-hidden">
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
        <Notification />
      </body>
    </html>
  );
}