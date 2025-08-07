"use client";
import { useEffect, useState } from "react";


type Tipo = {
  id: number;
  nombre: string;
  icono: string;
  color: string;
};

type TiposMap = {
  [key: string]: Tipo[];
};

const tipoEndpoints = [
  { key: "eventos", label: "Tipos de eventos", endpoint: "/api/tipo-evento" },
  { key: "notas", label: "Tipos de notas", endpoint: "/api/tipo-nota" },
  { key: "recursos", label: "Tipos de recursos", endpoint: "/api/tipo-recurso" },
];

export default function ConfigTiposPage() {
  const [tipos, setTipos] = useState<TiposMap>({ eventos: [], notas: [], recursos: [] });
  const [loading, setLoading] = useState(false);
  const [editTipo, setEditTipo] = useState<any>(null);
  const [form, setForm] = useState<any>({ nombre: "", icono: "", color: "#000000" });
  const [activeTab, setActiveTab] = useState("eventos");

  useEffect(() => {
    async function fetchTipos() {
      setLoading(true);
      const results: any = {};
      for (const tipo of tipoEndpoints) {
        const res = await fetch(tipo.endpoint);
        const data = await res.json();
        results[tipo.key] = data;
      }
      setTipos(results);
      setLoading(false);
    }
    fetchTipos();
  }, []);

  function handleEdit(tipo: any) {
    setEditTipo(tipo);
    setForm({ nombre: tipo.nombre, icono: tipo.icono, color: tipo.color });
  }

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setLoading(true);
    const endpoint = tipoEndpoints.find(t => t.key === activeTab)?.endpoint;
    if (!endpoint) {
      setLoading(false);
      return;
    }
    if (editTipo) {
      await fetch(`${endpoint}/${editTipo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setEditTipo(null);
    setForm({ nombre: "", icono: "", color: "#000000" });
    // Refresh
    const res = await fetch(endpoint);
    const data = await res.json();
    setTipos({ ...tipos, [activeTab]: data });
    setLoading(false);
  }

  async function handleDelete(id: any) {
    setLoading(true);
    const endpoint = tipoEndpoints.find(t => t.key === activeTab)?.endpoint;
    if (!endpoint) {
      setLoading(false);
      return;
    }
    await fetch(`${endpoint}/${id}`, {
      method: "DELETE"
    });
    const res = await fetch(endpoint);
    const data = await res.json();
    setTipos({ ...tipos, [activeTab]: data });
    setLoading(false);
  }

  return (
    <div className="h-screen w-full bg-white dark:bg-gray-900 p-8">
      <h1 className="text-2xl font-bold text-primary dark:text-primary mb-6">Mantenimiento de tipos</h1>
      <div className="flex gap-4 mb-8">
        {tipoEndpoints.map(t => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-150 ${activeTab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
            onClick={() => { setActiveTab(t.key); setEditTipo(null); setForm({ nombre: "", icono: "", color: "#000000" }); }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold mb-4">Listado</h2>
          {loading ? <div className="text-gray-400">Cargando...</div> : (
            <ul className="space-y-3">
              {tipos[activeTab]?.map((tipo: any) => (
                <li key={tipo.id} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800">
                  <span className="text-2xl" style={{ color: tipo.color }}>{tipo.icono.startsWith('fa-') ? <i className={`fa ${tipo.icono}`}></i> : tipo.icono}</span>
                  <span className="font-semibold text-primary dark:text-primary">{tipo.nombre}</span>
                  <span className="ml-auto text-xs" style={{ color: tipo.color }}>{tipo.color}</span>
                  <button className="ml-2 px-2 py-1 rounded bg-blue-500 text-white text-xs" onClick={() => handleEdit(tipo)}>Editar</button>
                  <button className="ml-2 px-2 py-1 rounded bg-red-500 text-white text-xs" onClick={() => handleDelete(tipo.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">{editTipo ? "Editar tipo" : "Crear nuevo tipo"}</h2>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="w-full px-3 py-2 rounded border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icono (FontAwesome o texto)</label>
              <input type="text" name="icono" value={form.icono} onChange={handleChange} className="w-full px-3 py-2 rounded border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="fa-calendar, fa-bolt, etc. o emoji" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color (hex)</label>
              <input type="color" name="color" value={form.color} onChange={handleChange} className="w-16 h-10 p-0 border rounded" />
              <input type="text" name="color" value={form.color} onChange={handleChange} className="ml-2 w-32 px-3 py-2 rounded border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100" required />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold">{editTipo ? "Guardar cambios" : "Crear tipo"}</button>
              {editTipo && <button type="button" className="px-4 py-2 rounded bg-gray-400 text-white font-semibold" onClick={() => { setEditTipo(null); setForm({ nombre: "", icono: "", color: "#000000" }); }}>Cancelar</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
