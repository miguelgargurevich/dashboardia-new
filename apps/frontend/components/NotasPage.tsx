import { useState, useEffect } from "react";
import { FiFile, FiTag, FiUserCheck, FiPlus } from "react-icons/fi";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getTiposNotas, getTiposRecursos } from "../config/tipos";

function NotasPage() {
  // const supabase = useSupabaseClient();
  const [nota, setNota] = useState<{ titulo: string; contenido: string; tipo: string; recursos: any[] }>({
    titulo: "",
    contenido: "",
    tipo: "",
    recursos: [],
  });
  const [recursos, setRecursos] = useState<any[]>([]);
  const [tiposNotas, setTiposNotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setNota({ ...nota, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
    const res = await fetch(`${API_BASE}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...nota,
        recursos: nota.recursos.map((r: any) => r.id)
      }),
    });
    setLoading(false);
    setNota({ titulo: "", contenido: "", tipo: "", recursos: [] });
  };

  // Cargar tipos de notas al montar
  useEffect(() => {
    getTiposNotas().then(setTiposNotas);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiTag /> Crear nota
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <input
          name="titulo"
          value={nota.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          required
        />
        <textarea
          name="contenido"
          value={nota.contenido}
          onChange={handleChange}
          placeholder="Contenido"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          rows={4}
          required
        />
        <select
          name="tipo"
          value={nota.tipo}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          required
        >
          <option value="">Tipo de nota</option>
          {tiposNotas.map((t: any) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>
        <div>
          <label className="block font-semibold mb-2">Recursos asociados</label>
          <div className="flex flex-wrap gap-2">
            {recursos.map((r: any) => (
              <button
                type="button"
                key={r.id}
                className={`px-2 py-1 rounded border flex items-center gap-1 ${nota.recursos.includes(r) ? "bg-primary text-white" : "bg-gray-100"}`}
                onClick={() => setNota({ ...nota, recursos: nota.recursos.includes(r) ? nota.recursos.filter((x: any) => x !== r) : [...nota.recursos, r] })}
              >
                <FiFile /> {r.nombre}
              </button>
            ))}
            <a href="/recursos" className="px-2 py-1 rounded border bg-accent text-white flex items-center gap-1">
              <FiPlus /> Agregar recurso
            </a>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded bg-primary text-white font-bold hover:bg-primary/80"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar nota"}
        </button>
      </form>
    </div>
  );
}

export default NotasPage;
