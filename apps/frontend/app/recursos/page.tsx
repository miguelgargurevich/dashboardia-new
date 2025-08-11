"use client";
import { useState, useEffect } from "react";
import { FiFile, FiEdit, FiTrash2, FiPlus, FiLink, FiTag, FiSearch } from "react-icons/fi";
import { getTiposRecursos } from "../../config/tipos";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

function ResourceList({ resources, selectedId, onSelect, tiposRecursos, onNew, search, onSearch }: any) {
  return (
    <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto pl-8">
      <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700">
        <h2 className="text-lg font-bold text-primary dark:text-primary">Recursos</h2>
        <button className="text-primary dark:text-primary flex items-center gap-1 font-semibold" onClick={onNew}><FiPlus className="text-primary dark:text-primary" /> Nuevo</button>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {(Array.isArray(resources) ? [...resources].sort((a, b) => {
          const dateA = new Date(a.fecha || a.createdAt || a.date || 0);
          const dateB = new Date(b.fecha || b.createdAt || b.date || 0);
          return dateB.getTime() - dateA.getTime();
        }) : []).map((resource: any) => {
          const tipo = tiposRecursos.find((t: any) => t.id === resource.tipo || t.nombre === resource.tipo);
          // Extraer color hexadecimal
          let iconColor = tipo?.color || '';
          return (
            <li key={resource.id} className={`cursor-pointer px-4 py-3 hover:bg-primary/10 dark:hover:bg-accent/10 ${selectedId === resource.id ? "bg-primary/10 dark:bg-accent/10" : ""}`}
                style={iconColor ? { borderLeft: `4px solid ${iconColor}` } : {}}
                onClick={() => onSelect(resource.id)}>
              <div className="flex items-center gap-2">
                {tipo && tipo.icono && (
                  tipo.icono.startsWith('fa-')
                    ? <span className="text-xl"><i className={`fa ${tipo.icono}`} style={iconColor ? { color: iconColor } : {}}></i></span>
                    : <span className="text-xl" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>
                )}
                <span className="font-normal text-gray-500 dark:text-gray-400">{resource.titulo || resource.nombre}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-200">{tipo ? tipo.nombre : resource.tipo}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ResourceViewer({ resource, onEdit, onDelete, tiposRecursos, isEditing, onSave, onCancel, isCreating }: any) {

  const [editData, setEditData] = useState<any>(resource);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // Reset file when resource, isEditing, or isCreating changes
  useEffect(() => {
    setFile(null);
  }, [resource, isEditing, isCreating]);
  const safeTiposRecursos = Array.isArray(tiposRecursos) ? tiposRecursos : [];
  const [tipoFiltro, setTipoFiltro] = useState("");
  useEffect(() => {
    // Find tipo id if resource.tipo is nombre
    let tipoId = resource?.tipo;
    if (tipoId && safeTiposRecursos.length) {
      const foundTipo = safeTiposRecursos.find(t => t.id === tipoId || t.nombre === tipoId);
      tipoId = foundTipo ? foundTipo.id : "";
    }
    setEditData({
      ...resource,
      tipo: tipoId || "",
    });
  }, [resource, safeTiposRecursos]);
  const tipo = safeTiposRecursos.find((t: any) => t.id === (isEditing || isCreating ? editData?.tipo : resource?.tipo) || t.nombre === (isEditing || isCreating ? editData?.tipo : resource?.tipo));
  // Color hexadecimal para el icono
  let iconColor = tipo?.color || '';
  if (isEditing || isCreating) {
    return (
      <div className="flex-1 p-8">
        <form className="space-y-4 max-w-xl" onSubmit={async e => {
          e.preventDefault();
          let url = editData.url;
          if (file) {
            if (file.size > 10 * 1024 * 1024) {
              alert('El archivo supera el límite de 10 MB');
              return;
            }
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
            const res = await fetch(`${apiBase.replace(/\/$/, '')}/upload`, {
              method: 'POST',
              body: formData,
            });
              const result = await res.json();
              if (!res.ok) {
                alert('Error al subir el archivo: ' + (result.error || 'Error desconocido'));
                setUploading(false);
                return;
              }
        <div className="relative w-64">
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none transition-colors pl-10 appearance-none"
            value={tipoFiltro || ""}
            onChange={e => setTipoFiltro(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {tiposRecursos.map((t: any) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
        </div>
              url = result.url;
            } catch (err: any) {
              alert('Error al subir el archivo: ' + err.message);
              setUploading(false);
              return;
            }
            setUploading(false);
          }
          await onSave({ ...editData, url });
        }}>
          {/* Título o nombre con icono y borde igual que notas */}
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.titulo || ""}
              onChange={e => setEditData({ ...editData, titulo: e.target.value })}
              placeholder="Título o nombre"
              required
            />
            {/* Icono dinámico según tipo seleccionado */}
            {tipo && tipo.icono ? (
              tipo.icono.startsWith('fa-')
                ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl" style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}>
                    <i className={`fa ${tipo.icono} ${tipo.color && tipo.color.startsWith('text-') ? tipo.color : ''}`}></i>
                  </span>
                : tipo.color && tipo.color.startsWith('text-')
                  ? <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-2xl ${tipo.color}`}>{tipo.icono}</span>
                  : <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl" style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}>{tipo.icono}</span>
            ) : (
              <FiEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
            )}
          </div>
          <div className="relative mb-4">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.descripcion || ""}
              onChange={e => setEditData({ ...editData, descripcion: e.target.value })}
              rows={4}
              placeholder="Descripción"
            />
            <FiFile className="absolute left-3 top-4 text-accent" />
          </div>
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={Array.isArray(editData?.tags) ? editData.tags.join(", ") : ""}
              onChange={e => setEditData({ ...editData, tags: e.target.value.split(",").map((tag: string) => tag.trim()) })}
              placeholder="Tags (separados por coma)"
            />
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div className="relative mb-4 w-64">
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10 appearance-none"
              style={{ height: '42px' }}
              value={editData?.tipo || ""}
              onChange={e => setEditData({ ...editData, tipo: e.target.value })}
              required
            >
              <option value="">Tipo de recurso</option>
              {safeTiposRecursos.map((t: any) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
            {/* Icono dinámico según tipo seleccionado */}
            {tipo && tipo.icono ? (
              tipo.icono.startsWith('fa-')
                ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}>
                    <i className={`fa ${tipo.icono} ${tipo.color && tipo.color.startsWith('text-') ? tipo.color : ''}`}></i>
                  </span>
                : tipo.color && tipo.color.startsWith('text-')
                  ? <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl ${tipo.color}`}>{tipo.icono}</span>
                  : <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}>{tipo.icono}</span>
            ) : (
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
            )}
          </div>
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.url || ""}
              onChange={e => setEditData({ ...editData, url: e.target.value })}
              placeholder="URL o enlace (opcional)"
              disabled={uploading}
            />
            <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div className="mb-2">
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">Adjuntar archivo <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(máx 10 MB)</span></label>
            <div className="flex items-center gap-3">
              <label className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors ${uploading ? 'opacity-60 cursor-not-allowed' : ''} ${file ? 'bg-primary/10 dark:bg-primary/20 border-primary dark:border-primary' : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20'}`}
                style={{ pointerEvents: uploading ? 'none' : 'auto' }}>
                <FiFile className="text-xl text-primary mr-2" />
                <span className={`text-sm font-medium ${file ? 'text-primary dark:text-primary' : 'text-gray-700 dark:text-gray-200'}`}>{file ? file.name : 'Selecciona archivo'}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                />
              </label>
              {file && !uploading && (
                <button type="button" className="ml-2 px-2 py-1 rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs font-semibold" onClick={() => setFile(null)}>Quitar</button>
              )}
              {uploading && <span className="ml-2 text-primary flex items-center gap-1"><FiLink className="animate-spin" /> Subiendo archivo...</span>}
            </div>
            {file && !uploading && file.size > 10 * 1024 * 1024 && (
              <div className="text-red-500 text-xs mt-1">El archivo supera el límite de 10 MB</div>
            )}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded bg-primary text-white font-bold hover:bg-primary/80">{isCreating ? "Crear" : "Guardar"}</button>
            <button type="button" className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }
  if (!resource) return <div className="flex-1 flex items-center justify-center text-gray-400">Selecciona un recurso</div>;
  return (
    <div className="flex-1 p-8 bg-bg dark:bg-bg-dark rounded-lg shadow overflow-y-auto" style={tipo?.color && tipo.color.startsWith('#') ? { borderLeft: `6px solid ${tipo.color}` } : {}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-400 flex items-center gap-2">
          {tipo && tipo.icono && (
            tipo.icono.startsWith('fa-')
              ? <span className="text-2xl"><i className={`fa ${tipo.icono}`} style={iconColor ? { color: iconColor } : {}}></i></span>
              : <span className="text-2xl" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>
          )}
          <span className="text-gray-500 dark:text-gray-400">{resource.titulo || resource.nombre}</span>
        </h2>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 rounded bg-primary text-white hover:bg-primary/80"><FiEdit /></button>
          <button onClick={onDelete} className="p-2 rounded bg-red-500 text-white hover:bg-red-600"><FiTrash2 /></button>
        </div>
      </div>
      <div className="mb-4 text-gray-700 dark:text-gray-100 whitespace-pre-line">{resource.descripcion}</div>
      <div className="mb-4 flex items-center gap-2">
        <span className="font-semibold text-gray-900 dark:text-gray-100">Tipo:</span>
        {tipo && tipo.icono && (
          tipo.icono.startsWith('fa-')
            ? <span className="text-xl"><i className={`fa ${tipo.icono}`} style={iconColor ? { color: iconColor } : {}}></i></span>
            : <span className="text-xl" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>
        )}
        <span className="text-gray-900 dark:text-gray-100">{tipo ? tipo.nombre : resource.tipo}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-900 dark:text-gray-100">Tags:</span> <span className="text-gray-900 dark:text-gray-100">{resource.tags?.join(", ")}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-900 dark:text-gray-100">URL:</span> {resource.url ? <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{resource.url}</a> : <span className="text-gray-900 dark:text-gray-100">Sin enlace</span>}
      </div>
      {/* Recursos relacionados section removed as requested */}
    </div>
  );
}

// Type guard para recursos relacionados
function isResourceObject(obj: any): obj is { url?: string; titulo?: string } {
  return obj && typeof obj === 'object' && (typeof obj.url === 'string' || typeof obj.titulo === 'string');
}

// Renderizado seguro de recursos relacionados
function renderRelatedResources(relatedResources: any[], tipo: any) {
  if (!Array.isArray(relatedResources) || relatedResources.length === 0) {
    return <span className="text-xs text-gray-400 dark:text-gray-400">Sin recursos</span>;
  }
  return relatedResources.map((r, i) => {
    if (isResourceObject(r)) {
      return (
        <a
          key={r.url || r.titulo || i}
          href={r.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 rounded flex items-center gap-1 hover:underline"
          style={tipo?.color ? { border: `1px solid ${tipo.color}`, background: tipo.color + '22', color: tipo.color } : {}}
        >
          {tipo && tipo.icono && (tipo.icono.startsWith('fa-')
            ? <span className="text-lg">
                <i className={`fa ${tipo.icono} ${tipo.color && tipo.color.startsWith('text-') ? tipo.color : ''}`}
                  style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}></i>
              </span>
            : tipo.color && tipo.color.startsWith('text-')
              ? <span className={`text-lg ${tipo.color}`}>{tipo.icono}</span>
              : <span className="text-lg" style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}>{tipo.icono}</span>
          )}
          {r.titulo || r.url}
        </a>
      );
    } else if (typeof r === 'string') {
      return (
        <a
          key={r + i}
          href={r}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 rounded flex items-center gap-1 hover:underline"
          style={tipo?.color ? { border: `1px solid ${tipo.color}`, background: tipo.color + '22', color: tipo.color } : {}}
        >
          {tipo && tipo.icono && (tipo.icono.startsWith('fa-')
            ? <span className="text-lg">
                <i className={`fa ${tipo.icono} ${tipo.color && tipo.color.startsWith('text-') ? tipo.color : ''}`}
                  style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}></i>
              </span>
            : tipo.color && tipo.color.startsWith('text-')
              ? <span className={`text-lg ${tipo.color}`}>{tipo.icono}</span>
              : <span className="text-lg" style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}>{tipo.icono}</span>
          )}
          {r}
        </a>
      );
    } else {
      return null;
    }
  });
}

export default function RecursosRoute() {

  const [resources, setResources] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [tiposRecursos, setTiposRecursos] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newResource, setNewResource] = useState<any>({ titulo: "", descripcion: "", tipo: "", tags: [], url: "" });
  const [search, setSearch] = useState("");

  // Cargar recursos y tipos de recursos al montar
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/resources`);
        const recursos = await res.json();
        setResources(Array.isArray(recursos) ? recursos : []);
      } catch (err) {
        setResources([]);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchTipos() {
      try {
        const tipos = await getTiposRecursos();
        setTiposRecursos(Array.isArray(tipos) ? tipos : []);
      } catch (err) {
        setTiposRecursos([]);
      }
    }
    fetchTipos();
  }, []);

  // Actualizar recurso seleccionado cuando cambia selectedId o resources
  useEffect(() => {
    if (selectedId) {
      const found = resources.find(r => r.id === selectedId);
      setSelectedResource(found || null);
    } else {
      setSelectedResource(null);
    }
  }, [selectedId, resources]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => { setIsEditing(false); setIsCreating(false); };
  const handleSave = async (editData: any) => {
    if (isCreating) {
      const res = await fetch(`${API_BASE}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const created = await res.json();
      setResources([...resources, created]);
      setSelectedId(created.id);
      setIsCreating(false);
    } else if (isEditing && selectedResource) {
      const res = await fetch(`${API_BASE}/resources/${selectedResource.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const updated = await res.json();
      setResources(resources.map((r: any) => r.id === updated.id ? updated : r));
      setSelectedId(updated.id);
      setIsEditing(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedResource) return;
    if (confirm("¿Seguro que quieres eliminar este recurso?")) {
      await fetch(`${API_BASE}/resources/${selectedResource.id}`, { method: "DELETE" });
      setResources(resources.filter(r => r.id !== selectedResource.id));
      setSelectedId(null);
    }
  };
  const handleNew = () => {
    // Buscar el tipo 'Enlaces Web' en tiposRecursos
    const tipoEnlace = tiposRecursos.find((t: any) => t.nombre?.toLowerCase() === "enlaces web");
    setNewResource({
      titulo: "",
      descripcion: "",
      tipo: tipoEnlace ? tipoEnlace.id : "Enlaces Web",
      tags: [],
      url: ""
    });
    setSelectedId(null);
    setIsCreating(true);
  };

  // Igual que en notas/eventos: no cambiar de recurso si está en modo edición o creación
  const handleSelect = (id: string) => {
    if (isEditing || isCreating) return;
    setSelectedId(id);
    setIsEditing(false);
    setIsCreating(false);
  };

  const [tipoFiltro, setTipoFiltro] = useState("");
  return (
    <div className="flex flex-col h-screen bg-bg dark:bg-bg-dark rounded-lg shadow overflow-hidden">
      <div className="w-full px-8 pt-4">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-primary">Gestión de Recursos</h1>
        <div className="flex gap-4 mb-4">
          <div className="relative w-64">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              placeholder="Buscar por título, descripción, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div className="relative w-64">
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none transition-colors pl-10 appearance-none"
              value={tipoFiltro || ""}
              onChange={e => setTipoFiltro(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {tiposRecursos.map((t: any) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-120px)]">
        <ResourceList
          resources={resources.filter(r => {
            const searchLower = search.toLowerCase();
            const matchesSearch =
              (r.titulo || r.nombre)?.toLowerCase().includes(searchLower) ||
              r.descripcion?.toLowerCase().includes(searchLower) ||
              (Array.isArray(r.tags) ? r.tags.join(",").toLowerCase().includes(searchLower) : false);
            // Filtro robusto por tipo: compara id y nombre
            const tipoObj = tiposRecursos.find(t => t.id === r.tipo || t.nombre?.toLowerCase() === r.tipo?.toLowerCase());
            const tipoId = tipoObj?.id || r.tipo;
            const tipoNombre = tipoObj?.nombre?.toLowerCase() || r.tipo?.toLowerCase();
            const filtroObj = tiposRecursos.find(t => t.id === tipoFiltro || t.nombre?.toLowerCase() === tipoFiltro?.toLowerCase());
            const filtroId = filtroObj?.id || tipoFiltro;
            const filtroNombre = filtroObj?.nombre?.toLowerCase() || tipoFiltro?.toLowerCase();
            const matchesTipo = tipoFiltro
              ? (tipoId === filtroId || tipoNombre === filtroNombre)
              : true;
            return matchesSearch && matchesTipo;
          })}
          selectedId={selectedId}
          onSelect={handleSelect}
          tiposRecursos={tiposRecursos}
          onNew={handleNew}
          search={search}
          onSearch={setSearch}
        />
        <ResourceViewer
          resource={isCreating ? newResource : selectedResource}
          onEdit={handleEdit}
          onDelete={handleDelete}
          tiposRecursos={tiposRecursos}
          isEditing={isEditing}
          isCreating={isCreating}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}