"use client";
import React, { useState, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaFileUpload } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
// Si usas Tailwind, los estilos ya están incluidos
// Si usas otra librería, adapta las clases

const FloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: input, descripcion: input, tipo: 'nota' })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { role: 'assistant', content: data.contenido }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Error al conectar con el asistente.' }]);
    }
    setInput('');
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessages(msgs => [...msgs, { role: 'user', content: `Archivo enviado: ${file.name}` }]);
    // Aquí puedes llamar a tu endpoint de recursos para subir el archivo
    // Ejemplo:
    // const formData = new FormData();
    // formData.append('file', file);
    // await fetch('/api/recursos/upload', { method: 'POST', body: formData });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          className="bg-blue-600 text-white rounded-full shadow-lg p-4 hover:bg-blue-700 transition"
          onClick={() => setOpen(true)}
        >
          <FaRobot size={28} />
        </button>
      )}
      {open && (
        <div className="w-96 h-[32rem] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
            <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2"><FaRobot /> Asistente</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={msg.role === 'user' ? 'inline-block bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-lg px-3 py-2' : 'inline-block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2'}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-400">Pensando...</div>}
          </div>
          <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border px-3 py-2 dark:bg-gray-900 dark:text-white"
              placeholder="Escribe tu pregunta o tarea..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' ? handleSend() : null}
              disabled={loading}
            />
            <button onClick={handleSend} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition" disabled={loading}>
              <FaPaperPlane />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              <FaFileUpload />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingAssistant;
