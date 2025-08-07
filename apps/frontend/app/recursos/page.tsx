"use client";

import { useState, useEffect } from "react";
import { FiFile, FiEdit, FiTrash2, FiPlus, FiLink } from "react-icons/fi";
import { getTiposRecursos } from "../../config/tipos";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

function ResourceList({ resources, selectedId, onSelect, tiposRecursos, onNew }: any) {
  return (
    <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700">
        <h2 className="text-lg font-bold text-primary dark:text-primary">Recursos</h2>
        <button className="text-primary dark:text-primary flex items-center gap-1 font-semibold" onClick={onNew}><FiPlus className="text-primary dark:text-primary" /> Nuevo</button>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {(Array.isArray(resources) ? resources : []).map((resource: any) => {
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
                <span className="font-semibold text-primary dark:text-primary">{resource.titulo || resource.nombre}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{tipo ? tipo.nombre : resource.tipo}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ResourceViewer({ resource, onEdit, onDelete, tiposRecursos, isEditing, onSave, onCancel, isCreating }: any) {
  const [editData, setEditData] = useState<any>(resource);
  useEffect(() => { setEditData(resource); }, [resource]);
  const safeTiposRecursos = Array.isArray(tiposRecursos) ? tiposRecursos : [];
  const tipo = safeTiposRecursos.find((t: any) => t.id === (isEditing || isCreating ? editData?.tipo : resource?.tipo) || t.nombre === (isEditing || isCreating ? editData?.tipo : resource?.tipo));
  // Color hexadecimal para el icono
  let iconColor = tipo?.color || '';
  if (isEditing || isCreating) {
    return (
      <div className="flex-1 p-8">
        <form className="space-y-4 max-w-xl" onSubmit={async e => {
          e.preventDefault();
          await onSave(editData);
        }}>
          <div className="flex items-center gap-2 mb-4">
            <input
              className="text-2xl font-bold flex-1 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              value={editData?.titulo || editData?.nombre || ""}
              onChange={e => setEditData({ ...editData, titulo: e.target.value, nombre: e.target.value })}
              placeholder="Título o nombre"
              required
            />
            {tipo && tipo.icono && (
              tipo.icono.startsWith('fa-')
                ? <span className="text-2xl"><i className={`fa ${tipo.icono}`} style={iconColor ? { color: iconColor } : {}}></i></span>
                : <span className="text-2xl" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>
            )}
          </div>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            value={editData?.descripcion || ""}
            onChange={e => setEditData({ ...editData, descripcion: e.target.value })}
            rows={4}
            placeholder="Descripción"
          />
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:outline-none transition-colors"
            value={editData?.tipo || ""}
            onChange={e => setEditData({ ...editData, tipo: e.target.value })}
            required
          >
            <option value="">Tipo de recurso</option>
            {tiposRecursos.map((t: any) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            value={editData?.url || ""}
            onChange={e => setEditData({ ...editData, url: e.target.value })}
            placeholder="URL o enlace (opcional)"
          />
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
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary dark:text-accent flex items-center gap-2">
          {tipo && tipo.icono && (
            tipo.icono.startsWith('fa-')
              ? <span className="text-2xl"><i className={`fa ${tipo.icono}`} style={iconColor ? { color: iconColor } : {}}></i></span>
              : <span className="text-2xl" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>
          )}
          {resource.titulo || resource.nombre}
        </h2>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 rounded bg-primary text-white hover:bg-primary/80"><FiEdit /></button>
          <button onClick={onDelete} className="p-2 rounded bg-red-500 text-white hover:bg-red-600"><FiTrash2 /></button>
        </div>
      </div>
      <div className="mb-4 text-gray-700 dark:text-gray-200 whitespace-pre-line">{resource.descripcion}</div>
      <div className="mb-4 flex items-center gap-2">
        <span className="font-semibold">Tipo:</span>
        {tipo && tipo.icono && (
          tipo.icono.startsWith('fa-')
            ? <span className="text-xl"><i className={`fa ${tipo.icono}`} style={iconColor ? { color: iconColor } : {}}></i></span>
            : <span className="text-xl" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>
        )}
        <span>{tipo ? tipo.nombre : resource.tipo}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Tags:</span> {resource.tags?.join(", ")}
      </div>
      <div className="mb-4">
        <span className="font-semibold">URL:</span> {resource.url ? <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{resource.url}</a> : "Sin enlace"}
      </div>
    </div>
  );
}

export default function RecursosRoute() {
  const [resources, setResources] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [tiposRecursos, setTiposRecursos] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newResource, setNewResource] = useState<any>({ titulo: "", descripcion: "", tipo: "", tags: [], url: "" });

  useEffect(() => {
    fetch(`${API_BASE}/resources`)
      .then(res => res.json())
      .then(setResources);
    getTiposRecursos().then(setTiposRecursos);
  }, []);

  useEffect(() => {
    setSelectedResource(resources.find(r => r.id === selectedId) || null);
    setIsEditing(false);
    setIsCreating(false);
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
    } else {
      const res = await fetch(`${API_BASE}/resources/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const updated = await res.json();
      setResources(resources.map(r => r.id === updated.id ? updated : r));
      setSelectedResource(updated);
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
    setNewResource({ titulo: "", descripcion: "", tipo: "", tags: [], url: "" });
    setSelectedId(null);
    setIsCreating(true);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <ResourceList resources={resources} selectedId={selectedId} onSelect={setSelectedId} tiposRecursos={tiposRecursos} onNew={handleNew} />
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
  );
}
