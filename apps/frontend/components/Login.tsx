"use client";
declare global {
  interface Window {
    openAssistantBubble?: () => void;
  }
}
import { useState } from 'react';
import { FaRobot } from 'react-icons/fa';

if (typeof window !== 'undefined') {
  window.openAssistantBubble = () => {
    const evt = new CustomEvent('open-assistant-bubble');
    window.dispatchEvent(evt);
  };
}
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-br from-primary via-[#16213e] to-[#23272f] font-inter">
        {/* Izquierda: Formulario de login */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-[#181c23]">
          <div className="w-full max-w-sm bg-[#181c23] rounded-2xl shadow-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold mb-6 text-[#bfc8e6] text-center font-poppins">Iniciar sesión</h2>
            <form
              className="space-y-4"
              onSubmit={async e => {
                e.preventDefault();
                setError("");
                try {
                  const { error } = await import('../lib/supabaseClient').then(({ supabase }) =>
                    supabase.auth.signInWithPassword({ email, password })
                  );
                  if (error) {
                    setError(error.message);
                    return;
                  }
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('close-assistant-bubble'));
                  }
                  router.push('/dashboard');
                } catch (err) {
                  setError('No se pudo conectar a Supabase');
                }
              }}
            >
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1a2636]/80 text-white border border-accent focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-gray-300 font-inter"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1a2636]/80 text-white border border-accent focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-gray-300 font-inter"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#23272f] text-[#bfc8e6] font-bold font-poppins hover:bg-[#353a45] transition-colors shadow-md"
              >
                Acceder
              </button>
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-[#23272f] text-[#bfc8e6] font-bold font-poppins hover:bg-[#353a45] transition-colors shadow-md"
                onClick={async () => {
                  setError("");
                  try {
                    const { supabase } = await import('../lib/supabaseClient');
                    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } });
                    if (error) setError(error.message);
                  } catch (err) {
                    setError('No se pudo conectar a Supabase');
                  }
                }}
              >
                Acceder con Google
              </button>
              {error && (
                <div className="mt-2 text-red-400 text-sm text-center">{error}</div>
              )}
            </form>
          </div>
        </div>
        {/* Derecha: Robot IA con animación de pulso */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-[#23272f] relative">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-accent p-6 shadow-2xl animate-pulse cursor-pointer" onClick={() => window.openAssistantBubble && window.openAssistantBubble()}>
              <FaRobot size={80} color="#0D1B2A" />
            </div>
            <span className="mt-6 text-lg font-semibold text-[#bfc8e6] font-poppins">Asistente IA</span>
          </div>
        </div>
      </div>
    </>
  );
}
