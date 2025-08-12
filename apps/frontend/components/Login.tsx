"use client";
declare global {
  interface Window {
    openAssistantBubble?: () => void;
  }
}
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaRobot } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const { supabase } = await import('../lib/supabaseClient');
      if (showPhoneLogin) {
        if (!otpSent) {
          // Enviar OTP al teléfono
          const { error } = await supabase.auth.signInWithOtp({ phone });
          if (error) {
            setError(error.message);
            return;
          }
          setOtpSent(true);
          setSuccess('Código enviado por SMS. Ingresa el código para continuar.');
        } else {
          // Verificar OTP
          const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
          if (error) {
            setError(error.message);
            return;
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('close-assistant-bubble'));
          }
          router.push('/dashboard');
        }
        return;
      }
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setError(error.message);
          return;
        }
        setSuccess('Registro exitoso. Revisa tu correo para verificar tu cuenta.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          return;
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('close-assistant-bubble'));
        }
        router.push('/dashboard');
      }
    } catch (err) {
      setError('No se pudo conectar a Supabase');
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-br from-primary via-[#16213e] to-[#23272f] font-inter">
        {/* Izquierda: Formulario de login/registro */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-[#181c23]">
          <div className="w-full max-w-sm bg-[#181c23] rounded-2xl shadow-2xl p-8 border border-white/10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-4xl font-extrabold shadow focus:outline-none focus:ring-2 focus:ring-primary" style={{ fontFamily: 'Inter, sans-serif' }}>
                D
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-[#bfc8e6] text-center font-poppins">
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!showPhoneLogin ? (
                <>
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
                </>
              ) : (
                <>
                  <input
                    type="tel"
                    placeholder="Teléfono (+51...)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#1a2636]/80 text-white border border-accent focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-gray-300 font-inter"
                  />
                  {otpSent && (
                    <input
                      type="text"
                      placeholder="Código SMS"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#1a2636]/80 text-white border border-accent focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-gray-300 font-inter"
                    />
                  )}
                </>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#23272f] text-[#bfc8e6] font-bold font-poppins hover:bg-[#353a45] transition-colors shadow-md"
              >
                {showPhoneLogin ? (otpSent ? 'Verificar código' : 'Enviar código SMS') : (isSignUp ? 'Registrarse' : 'Acceder')}
              </button>
              <div className="flex justify-center mt-2 gap-2">
                <button
                  type="button"
                  className="text-xs text-accent underline hover:text-primary"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setIsSignUp(!isSignUp);
                  }}
                >
                  {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                </button>
                <button
                  type="button"
                  className="text-xs text-accent underline hover:text-primary"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setShowPhoneLogin(!showPhoneLogin);
                    setOtpSent(false);
                    setPhone('');
                    setOtp('');
                  }}
                >
                  {showPhoneLogin ? 'Usar email y contraseña' : 'Acceder con teléfono'}
                </button>
              </div>
              {error && (
                <div className="mt-2 text-red-400 text-sm text-center">{error}</div>
              )}
              {success && (
                <div className="mt-2 text-green-400 text-sm text-center">{success}</div>
              )}
            </form>
            {/* Sección de login con otros proveedores */}
            <div className="mt-8">
              <div className="text-center text-xs text-gray-400 mb-2">O accede con otros proveedores</div>
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-white text-gray-800 font-bold font-poppins flex items-center justify-center gap-2 border border-gray-300 shadow-md hover:bg-gray-100 transition-colors"
                onClick={async () => {
                  setError("");
                  setSuccess("");
                  try {
                    const { supabase } = await import('../lib/supabaseClient');
                    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } });
                    if (error) setError(error.message);
                  } catch (err) {
                    setError('No se pudo conectar a Supabase');
                  }
                }}
              >
                <FcGoogle size={22} />
                Acceder con Google
              </button>
            </div>
          </div>
        </div>
        {/* Derecha: Robot IA con animación de pulso */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-[#23272f] relative">
          <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-600 p-6 shadow-2xl animate-pulse">
                <FaRobot size={80} color="#fff" />
            </div>
            <span className="mt-6 text-lg font-semibold text-[#bfc8e6] font-poppins">Dashboard IA</span>
            <p className="mt-4 text-base text-gray-300 text-center max-w-xs">
              Tu asistente inteligente para gestionar notas, recursos y eventos.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
