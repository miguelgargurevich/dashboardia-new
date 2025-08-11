"use client";
import { useEffect, useState } from "react";
import { FiUser, FiMail, FiKey, FiLink } from "react-icons/fi";

export default function UsuariosPage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const { supabase } = await import("../../lib/supabaseClient");
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setName(data.user.user_metadata?.name || "");
        setAvatar(data.user.user_metadata?.avatar_url || "");
      }
    }
    fetchUser();
  }, []);

  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      const { supabase } = await import("../../lib/supabaseClient");
      const updates = {
        data: { name, avatar_url: avatar }
      };
      const { error } = await supabase.auth.updateUser(updates);
      if (error) {
        setError(error.message);
        return;
      }
      setSuccess("Datos actualizados correctamente.");
    } catch (err) {
      setError("No se pudo actualizar el usuario.");
    }
  };

  return (
    <main className="min-h-screenbg-bg dark:bg-bg-dark p-0">
      <div className="flex flex-col md:flex-row h-full w-full">
        <div className="flex-1 flex flex-col justify-center px-8 py-12 md:py-0 md:px-16bg-bg dark:bg-bg-dark border-r border-gray-200 dark:border-gray-950">
          <h1 className="text-3xl font-bold mb-6 mt-10 ml-2 text-primary dark:text-primary">Perfil de usuario</h1>
          {user ? (
            <form className="space-y-6 max-w-lg" onSubmit={e => {e.preventDefault(); handleSave();}}>
              <div className="relative mb-4">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Correo electrónico</label>
                <div className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 pl-10 relative">
                  {user.email}
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                </div>
              </div>
              <div className="relative mb-4">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Nombre</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent pl-10"
                  />
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                </div>
              </div>
              <div className="relative mb-4">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">ID de usuario</label>
                <div className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 pl-10 relative">
                  {user.id}
                  <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                </div>
              </div>
              <div className="relative mb-4">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Proveedor</label>
                <div className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 pl-10 relative">
                  {user.app_metadata?.provider || 'email'}
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                </div>
              </div>
              <div className="relative mb-4">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Email verificado</label>
                <div className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 pl-10 relative">
                  {user.email_confirmed_at ? 'Sí' : 'No'}
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                </div>
              </div>
              <div className="relative mb-4">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Fecha de registro</label>
                <div className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 pl-10 relative">
                  {new Date(user.created_at).toLocaleString()}
                  <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                </div>
              </div>
              <div className="relative mb-4">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">URL de avatar (opcional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                    placeholder="URL de avatar"
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent pl-10"
                  />
                  <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary dark:bg-accent text-white font-bold font-poppins hover:bg-primary/80 dark:hover:bg-accent/80 transition-colors shadow-md mt-2"
              >
                Guardar cambios
              </button>
              {error && <div className="mt-2 text-red-400 text-sm text-center">{error}</div>}
              {success && <div className="mt-2 text-green-400 text-sm text-center">{success}</div>}
            </form>
          ) : (
            <div className="text-gray-400 text-center">Cargando datos de usuario...</div>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-bg-dark border-l border-gray-200 dark:border-gray-900">
          {user && (
            <div className="w-64 h-64 flex items-center justify-center rounded-full border-8 border-primary dark:border-accent shadow-2xl bg-gray-50 dark:bg-bg-dark">
              <img
                src={avatar || `https://ui-avatars.com/api/?name=${user.email}`}
                alt="Avatar"
                className="w-56 h-56 rounded-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
