'use client';

import { useState, useEffect } from 'react';

export default function Notification() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Mostrar mensagem de boas-vindas
    setMessage('Bem-vindo(a), João Silva! 👋');
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 3000);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-fadeIn">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <i className="fas fa-check-circle"></i>
        <span>{message}</span>
      </div>
    </div>
  );
}