"use client";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";


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
  // Solo iconos FontAwesome base
  const faIconsBase = [
    "fa-calendar","fa-bolt","fa-star","fa-book","fa-bell","fa-lightbulb","fa-tasks","fa-check","fa-exclamation","fa-file","fa-user","fa-wrench","fa-map-pin","fa-tag","fa-clock","fa-cog","fa-heart","fa-info","fa-flag","fa-list","fa-rocket","fa-envelope","fa-folder","fa-search","fa-paperclip","fa-archive","fa-eye","fa-question","fa-calendar-check","fa-calendar-day","fa-calendar-week","fa-clipboard","fa-clipboard-list","fa-asterisk","fa-leaf","fa-fire","fa-bug","fa-moon","fa-sun","fa-cloud","fa-random","fa-sync","fa-undo","fa-redo","fa-arrow-up","fa-arrow-down","fa-arrow-left","fa-arrow-right","fa-plus","fa-minus","fa-times","fa-check-circle","fa-circle","fa-square","fa-play","fa-pause","fa-stop","fa-eraser","fa-robot","fa-database","fa-code","fa-cube","fa-cubes","fa-magic","fa-gift","fa-smile","fa-frown","fa-meh","fa-thumbs-up","fa-thumbs-down","fa-comment","fa-comments","fa-bell-slash"
  ];

  const [tipos, setTipos] = useState<TiposMap>({ eventos: [], notas: [], recursos: [] });
  const [loading, setLoading] = useState(false);
  const [editTipo, setEditTipo] = useState<any>(null);
  const [form, setForm] = useState<any>({ nombre: "", icono: "", color: "#000000" });
  const [activeTab, setActiveTab] = useState("eventos");
  const [showAllIcons, setShowAllIcons] = useState(false);

  // iconos de la base de datos (ya cargados)
  const faIconsFromDB = Array.from(new Set([
    ...((tipos.eventos || []).map(t => t.icono)),
    ...((tipos.notas || []).map(t => t.icono)),
    ...((tipos.recursos || []).map(t => t.icono))
  ].filter(icon => icon && icon.startsWith('fa-'))));
  const faIcons = Array.from(new Set([...faIconsBase, ...faIconsFromDB]));
  const iconSamples = faIcons.map(icon => ({ value: icon, label: <i className={`fa ${icon}`} /> }));

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
    <div className="h-screen w-full bg-bg dark:bg-bg-dark p-8">
      <h1 className="text-3xl font-bold text-primary dark:text-primary mb-8">Mantenimiento de tipos</h1>
      <div className="flex gap-4 mb-10">
        {tipoEndpoints.map(t => (
          <button
            key={t.key}
            className={`px-6 py-2 rounded-xl font-semibold border-2 shadow transition-all duration-150 text-base flex items-center gap-2
              ${activeTab === t.key ? "bg-orange-500 text-white border-orange-500 shadow-lg" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900 hover:text-orange-700"}`}
            onClick={() => { setActiveTab(t.key); setEditTipo(null); setForm({ nombre: "", icono: "", color: "#000000" }); }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold mb-6 text-primary dark:text-primary">Listado</h2>
          {loading ? <div className="text-gray-400">Cargando...</div> : (
            <ul className="space-y-4">
              {tipos[activeTab]?.map((tipo: any) => (
                <li key={tipo.id} className="flex items-center gap-4 p-5 rounded-2xl border-2 shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                  <span className="text-4xl" style={{ color: tipo.color }}>{tipo.icono.startsWith('fa-') ? <i className={`fa ${tipo.icono}`}></i> : tipo.icono}</span>
                  <div>
                    <span className="font-bold text-lg text-primary dark:text-primary">{tipo.nombre}</span>
                    <div className="text-xs mt-1 font-mono px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" style={{ color: tipo.color }}>{tipo.color}</div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded bg-primary text-white hover:bg-primary/80 flex items-center" onClick={() => handleEdit(tipo)}>
                      <span className="sr-only">Editar</span>
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded bg-red-500 text-white hover:bg-red-600 flex items-center" onClick={() => handleDelete(tipo.id)}>
                      <span className="sr-only">Eliminar</span>
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-6 text-primary dark:text-primary">{editTipo ? "Editar tipo" : "Crear nuevo tipo"}</h2>
          <form className="space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow p-8 border-2 border-gray-200 dark:border-gray-700" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary dark:text-primary">Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary dark:text-primary">Color (hex)</label>
              <div className="flex items-center gap-3">
                <input type="color" name="color" value={form.color} onChange={handleChange} className="w-12 h-12 p-0 border-2 rounded-lg" />
                <input type="text" name="color" value={form.color} onChange={handleChange} className="w-32 px-4 py-2 rounded-lg border-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all" required />
              </div>
            </div>

            {/* Icono (FontAwesome o texto) debajo de color */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary dark:text-primary">Icono (FontAwesome)</label>
              <div className="mb-3">
                <div className="grid grid-cols-8 gap-2 mb-2 transition-all duration-300" style={{ maxHeight: showAllIcons ? '1000px' : '120px', overflow: 'hidden' }}>
                  {(showAllIcons ? iconSamples : iconSamples.slice(0, 16)).map((icon, idx) => (
                    <button
                      type="button"
                      key={icon.value + idx}
                      className={`flex items-center justify-center text-2xl rounded-lg border-2 p-2 transition-all hover:bg-orange-100 dark:hover:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 ${form.icono === icon.value ? "border-orange-500 bg-orange-50 dark:bg-orange-900" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}`}
                      onClick={() => setForm({ ...form, icono: icon.value })}
                      aria-label={icon.value}
                    >
                      {icon.label}
                    </button>
                  ))}
                </div>
                {iconSamples.length > 16 && (
                  <button
                    type="button"
                    className="w-full py-2 text-sm text-orange-600 dark:text-orange-400 hover:underline focus:outline-none"
                    onClick={() => setShowAllIcons(v => !v)}
                  >
                    {showAllIcons ? "Mostrar menos" : "..más"}
                  </button>
                )}
              </div>
            </div>
           
            <div className="flex gap-3 mt-6">
              <button type="submit" className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base flex items-center gap-2 transition-colors">
                <i className="fa fa-save"></i> {editTipo ? "Guardar cambios" : "Crear tipo"}
              </button>
              {editTipo && <button type="button" className="px-6 py-2 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-bold text-base flex items-center gap-2 transition-colors" onClick={() => { setEditTipo(null); setForm({ nombre: "", icono: "", color: "#000000" }); }}>
                <i className="fa fa-times"></i> Cancelar
              </button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
