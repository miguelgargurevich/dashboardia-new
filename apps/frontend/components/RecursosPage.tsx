import { useState, useEffect } from "react";
import { FiFile, FiUpload, FiTag } from "react-icons/fi";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { getTiposRecursos } from "../config/tipos";

function RecursosPage() {
  // const supabase = useSupabaseClient();
  const [recurso, setRecurso] = useState({
    nombre: "",
    tipo: "",
    archivo: null,
  });
  const [loading, setLoading] = useState(false);
  const [tiposRecursos, setTiposRecursos] = useState<any[]>([]);

  const handleChange = (e: any) => {
    setRecurso({ ...recurso, [e.target.name]: e.target.value });
  };

  const handleFile = (e: any) => {
    setRecurso({ ...recurso, archivo: e.target.files[0] });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("nombre", recurso.nombre);
    formData.append("tipo", recurso.tipo);
    if (recurso.archivo) {
      formData.append("archivo", recurso.archivo);
    }
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
    const res = await fetch(`${API_BASE}/resources`, {
      method: "POST",
      body: formData,
    });
    setLoading(false);
    setRecurso({ nombre: "", tipo: "", archivo: null });
  };

  // Cargar tipos de recursos al montar
  useEffect(() => {
    getTiposRecursos().then(setTiposRecursos);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiFile /> Crear recurso
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <input
          name="nombre"
          value={recurso.nombre}
          onChange={handleChange}
          placeholder="Nombre del recurso"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          required
        />
        <select
          name="tipo"
          value={recurso.tipo}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          required
        >
          <option value="">Tipo de recurso</option>
          {tiposRecursos.map((t: any) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>
        <input
          type="file"
          name="archivo"
          onChange={handleFile}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-primary text-white font-bold hover:bg-primary/80"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar recurso"}
        </button>
      </form>
    </div>
  );
}

export default RecursosPage;
