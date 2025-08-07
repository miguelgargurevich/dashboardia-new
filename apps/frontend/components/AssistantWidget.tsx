"use client";
import { useState } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    setLoading(true);
    setResponse("");
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponse(data.response);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="bg-white dark:bg-darkBg rounded-xl shadow-2xl p-4 w-80 flex flex-col gap-2 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-primary dark:text-accent flex items-center gap-2"><FaRobot /> Asistente IA</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
          </div>
          <textarea
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-lightBg dark:bg-darkBg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="¿En qué puedo ayudarte?"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <button
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition disabled:opacity-50"
            onClick={sendPrompt}
            disabled={loading || !prompt}
          >
            <FaPaperPlane /> Enviar
          </button>
          {loading && <div className="text-xs text-gray-500">Pensando...</div>}
          {response && <div className="bg-lightBg dark:bg-gray-900 p-2 rounded text-sm mt-2">{response}</div>}
        </div>
      ) : (
        <button
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-secondary transition flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <FaRobot />
        </button>
      )}
    </div>
  );
}
