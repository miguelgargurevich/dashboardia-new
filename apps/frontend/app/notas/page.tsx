"use client";
import React, { useState, useEffect } from "react";
import { FiTag, FiEdit, FiTrash2, FiPlus, FiFile, FiSearch } from "react-icons/fi";
import { getTiposNotas } from "../../config/tipos";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";


function NoteList({ notes, selectedId, onSelect, tiposNotas, onNew }: any) {
  return (
    <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700">
        <h2 className="text-lg font-bold text-primary dark:text-primary">Notas</h2>
        <button className="text-primary dark:text-primary flex items-center gap-1 font-semibold" onClick={onNew}><FiPlus className="text-primary dark:text-primary" /> Nueva</button>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {(Array.isArray(notes) ? [...notes].sort((a, b) => {
          const dateA = new Date(a.fecha || a.createdAt || a.date || 0);
          const dateB = new Date(b.fecha || b.createdAt || b.date || 0);
          return dateB.getTime() - dateA.getTime();
        }) : []).map((note: any) => {
          const tipo = tiposNotas.find((t: any) => t.id === note.tipo || t.nombre === note.tipo);
          return (
            <li key={note.id}
                className={`cursor-pointer px-4 py-3 hover:bg-primary/10 dark:hover:bg-primary/10 ${selectedId === note.id ? "bg-primary/10 dark:bg-primary/10" : ""}`}
                style={tipo?.color && tipo.color.startsWith('#') ? { borderLeft: `4px solid ${tipo.color}` } : {}}
                onClick={() => onSelect(note.id)}>
              <div className="flex items-center gap-2">
                {tipo && tipo.icono && (tipo.icono.startsWith('fa-')
                  ? <span className="text-xl">
                      <i className={`fa ${tipo.icono} ${tipo.color && tipo.color.startsWith('text-') ? tipo.color : ''}`}
                        style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}></i>
                    </span>
                  : tipo.color && tipo.color.startsWith('text-')
                    ? <span className={`text-xl ${tipo.color}`}>{tipo.icono}</span>
                    : <span className="text-xl" style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}>{tipo.icono}</span>
                )}
                <span className="font-semibold text-gray-500 dark:text-gray-400">{note.title}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-200">{tipo ? tipo.nombre : note.tipo}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NoteViewer({ note, onEdit, onDelete, tiposNotas, isEditing, onSave, onCancel, isCreating, recursos }: any) {
  const [editData, setEditData] = useState<any>(note);
  useEffect(() => {
    setEditData({
      ...note,
      title: note?.title || note?.titulo || "",
      relatedResources: Array.isArray(note?.relatedResources) ? note.relatedResources : [],
    });
  }, [note]);
  const tipo = (Array.isArray(tiposNotas) ? tiposNotas : []).find((t: any) => t.id === (isEditing || isCreating ? editData?.tipo : note?.tipo) || t.nombre === (isEditing || isCreating ? editData?.tipo : note?.tipo));
  if (isEditing || isCreating) {
    // Ensure relatedResources is always an array
    const relatedResourcesArr = Array.isArray(editData?.relatedResources) ? editData.relatedResources : [];
    // Color hexadecimal para el icono
    let iconColor = tipo?.color || '';
    return (
      <div className="flex-1 p-8">
        <form className="space-y-4 max-w-xl" onSubmit={e => {
          e.preventDefault();
          onSave(editData);
        }}>
          {/* Título */}
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.title || ""}
              onChange={e => setEditData({ ...editData, title: e.target.value })}
              placeholder="Título"
              required
            />
            {/* Icono dinámico según tipo seleccionado */}
            {(() => {
              const tipoSel = tiposNotas.find((t: any) => t.id === editData?.tipo || t.nombre === editData?.tipo);
              if (tipoSel && tipoSel.icono) {
                if (tipoSel.icono.startsWith('fa-')) {
                  return (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={tipoSel.color && tipoSel.color.startsWith('#') ? { color: tipoSel.color } : {}}>
                      <i className={`fa ${tipoSel.icono} ${tipoSel.color && tipoSel.color.startsWith('text-') ? tipoSel.color : ''}`}></i>
                    </span>
                  );
                } else if (tipoSel.color && tipoSel.color.startsWith('text-')) {
                  return (
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl ${tipoSel.color}`}>{tipoSel.icono}</span>
                  );
                } else {
                  return (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={tipoSel.color && tipoSel.color.startsWith('#') ? { color: tipoSel.color } : {}}>{tipoSel.icono}</span>
                  );
                }
              }
              // Fallback: icono por defecto
              return <FiEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />;
            })()}
          </div>
          {/* Contenido */}
          <div className="relative mb-4">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.content || ""}
              onChange={e => setEditData({ ...editData, content: e.target.value })}
              rows={5}
              placeholder="Contenido"
              required
            />
            <FiFile className="absolute left-3 top-4 text-accent" />
          </div>
          {/* Tipo de nota */}
          <div className="relative mb-4 w-64">
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10 appearance-none"
              style={{ height: '42px' }}
              value={editData?.tipo || ""}
              onChange={e => setEditData({ ...editData, tipo: e.target.value })}
              required
            >
              <option value="">Tipo de nota</option>
              {tiposNotas.map((t: any) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
            {/* Icono dinámico según tipo seleccionado */}
            {(() => {
              const tipoSel = tiposNotas.find((t: any) => t.id === editData?.tipo || t.nombre === editData?.tipo);
              if (tipoSel && tipoSel.icono) {
                if (tipoSel.icono.startsWith('fa-')) {
                  return (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={tipoSel.color && tipoSel.color.startsWith('#') ? { color: tipoSel.color } : {}}>
                      <i className={`fa ${tipoSel.icono} ${tipoSel.color && tipoSel.color.startsWith('text-') ? tipoSel.color : ''}`}></i>
                    </span>
                  );
                } else if (tipoSel.color && tipoSel.color.startsWith('text-')) {
                  return (
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xl ${tipoSel.color}`}>{tipoSel.icono}</span>
                  );
                } else {
                  return (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" style={tipoSel.color && tipoSel.color.startsWith('#') ? { color: tipoSel.color } : {}}>{tipoSel.icono}</span>
                  );
                }
              }
              // Fallback: icono por defecto
              return <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />;
            })()}
          </div>
          {/* Tags */}
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.tags?.join(", ") || ""}
              onChange={e => setEditData({ ...editData, tags: e.target.value.split(",").map((tag: string) => tag.trim()) })}
              placeholder="Tags (separados por coma)"
            />
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-200">Recursos relacionados</label>
            <div className="flex flex-wrap gap-2">
              {recursos.map((r: any) => (
                <button
                  type="button"
                  key={r.id}
                  className={`px-2 py-1 rounded border flex items-center gap-1 transition-colors duration-150
                    ${relatedResourcesArr.includes(r.id)
                      ? "bg-primary text-white border-primary shadow"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                  onClick={() => setEditData({
                    ...editData,
                    relatedResources: relatedResourcesArr.includes(r.id)
                      ? relatedResourcesArr.filter((x: any) => x !== r.id)
                      : [...relatedResourcesArr, r.id]
                  })}
                >
                  <FiFile /> {r.titulo || r.nombre}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-4 py-2 rounded bg-primary text-white font-bold hover:bg-primary/80">{isCreating ? "Crear" : "Guardar"}</button>
            <button type="button" className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    );
  }
  if (!note) return <div className="flex-1 flex items-center justify-center text-gray-400">Selecciona una nota</div>;
  // Colored left border for selected note type
  const borderStyle = tipo?.color && tipo.color.startsWith('#') ? { borderLeft: `6px solid ${tipo.color}` } : {};
  return (
    <div className="flex-1 p-8 overflow-y-auto" style={borderStyle}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-400 flex items-center gap-2">
          {tipo && tipo.icono && (tipo.icono.startsWith('fa-')
            ? <span className="text-2xl" style={tipo.color ? { color: tipo.color } : {}}><i className={`fa ${tipo.icono}`}></i></span>
            : <span className="text-2xl" style={tipo.color ? { color: tipo.color } : {}}>{tipo.icono}</span>
          )}
          {note.title}
        </h2>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 rounded bg-primary text-white hover:bg-primary/80"><FiEdit /></button>
          <button onClick={onDelete} className="p-2 rounded bg-red-500 text-white hover:bg-red-600"><FiTrash2 /></button>
        </div>
      </div>
      <div className="mb-4 text-gray-700 dark:text-gray-100 whitespace-pre-line">{note.content}</div>
      <div className="mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-100">
        <span className="font-semibold">Tipo:</span>
          {tipo && tipo.icono && (tipo.icono.startsWith('fa-')
            ? <span className="text-xl">
                <i className={`fa ${tipo.icono} ${tipo.color && tipo.color.startsWith('text-') ? tipo.color : ''}`}
                  style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}></i>
              </span>
            : tipo.color && tipo.color.startsWith('text-')
              ? <span className={`text-xl ${tipo.color}`}>{tipo.icono}</span>
              : <span className="text-xl" style={tipo.color && tipo.color.startsWith('#') ? { color: tipo.color } : {}}>{tipo.icono}</span>
          )}
        <span>{tipo ? tipo.nombre : note.tipo}</span>
      </div>
     
      <div className="mb-4 text-gray-700 dark:text-gray-100">
        <span className="font-semibold">Tags:</span> {note.tags?.join(", ")}
      </div>
      <div className="mb-4 text-gray-700 dark:text-gray-100">
        <span className="font-semibold">Estado:</span> {note.status}
      </div>
        {/* Prioridad field hidden as requested */}
        <div className="mb-4 text-gray-700 dark:text-gray-100">
          <span className="font-semibold">Recursos relacionados:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {renderRelatedResources(note.relatedResources, tipo, recursos)}
          </div>
        </div>
    </div>
  );
}


// Type guard para recursos relacionados
function isResourceObject(obj: any): obj is { url?: string; titulo?: string } {
  return obj && typeof obj === 'object' && (typeof obj.url === 'string' || typeof obj.titulo === 'string');
}

// Renderizado seguro de recursos relacionados
function renderRelatedResources(relatedResources: any[], tipo: any, recursos: any[]) {
  if (!Array.isArray(relatedResources) || relatedResources.length === 0) {
    return <span className="text-xs text-gray-400 dark:text-gray-400">Sin recursos</span>;
  }
  return relatedResources.map((r, i) => {
    if (isResourceObject(r)) {
      return (
        <a
          key={r.url || r.titulo || i}
          href={r.url || '#'}
          target={r.url ? "_blank" : undefined}
          rel={r.url ? "noopener noreferrer" : undefined}
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
    }
    // Si es string (ID), buscar en recursos
    if (typeof r === 'string') {
      const recurso = recursos && Array.isArray(recursos) ? recursos.find((x: any) => x.id === r) : null;
      const titulo = recurso ? (recurso.titulo || recurso.nombre || recurso.url || r) : r;
      const url = recurso?.url || '';
      return url && url !== '' ? (
        <a
          key={r + i}
          href={url}
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
          {titulo}
        </a>
      ) : (
        <span
          key={r + i}
          className={"px-2 py-1 rounded flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"}
          style={tipo?.color ? { border: `1px solid ${tipo.color}` } : {}}
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
          {titulo}
        </span>
      );
    }
    return null;
  });
}

export default function NotasRoute() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [tiposNotas, setTiposNotas] = useState<any[]>([]);
  const [recursos, setRecursos] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState<any>({ title: "", content: "", tipo: "Nota", tags: [], relatedResources: [] });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/notes`)
      .then(res => res.json())
      .then(setNotes);
    getTiposNotas().then(setTiposNotas);
    import("../../config/tipos").then(mod => mod.getRecursos()).then(setRecursos);
  }, []);

  useEffect(() => {
    setSelectedNote((Array.isArray(notes) ? notes : []).find(n => n.id === selectedId) || null);
    setIsEditing(false);
    // Solo desactivar isCreating si no está en modo creación
    if (!isCreating) {
      setIsCreating(false);
    }
  }, [selectedId, notes]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => { setIsEditing(false); setIsCreating(false); };
  const handleSave = async (editData: any) => {
    // Sanitize payload: only send correct fields, avoid duplicates
    const payload = { ...editData };
    // Only send 'title', not 'titulo'
    if ('titulo' in payload) delete payload.titulo;
    // Only send 'tipo', not 'tipoNota' or other variants
    if ('tipoNota' in payload) delete payload.tipoNota;
    // Ensure relatedResources is an array of resource IDs
    if (Array.isArray(payload.relatedResources)) {
      payload.relatedResources = payload.relatedResources.map((r: any) => typeof r === 'object' && r.id ? r.id : r);
    }
    if (isCreating) {
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setNotes([...notes, created]);
      setSelectedId(created.id);
      setIsCreating(false);
    } else if (isEditing && selectedNote) {
      const res = await fetch(`${API_BASE}/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setNotes(notes.map((n: any) => n.id === updated.id ? updated : n));
      setSelectedId(updated.id);
      setIsEditing(false);
    }
  };
  const handleNew = () => {
    // Buscar el tipo 'Nota' en tiposNotas
    const tipoNota = tiposNotas.find((t: any) => t.nombre?.toLowerCase() === "nota");
    setNewNote({
      title: "",
      content: "",
      tipo: tipoNota ? tipoNota.id : "Nota",
      tags: [],
      relatedResources: []
    });
    setSelectedId(null);
    setIsCreating(true);
  };

  const handleDelete = async () => {
    if (!selectedNote) return;
    if (confirm("¿Seguro que quieres eliminar esta nota?")) {
      await fetch(`${API_BASE}/notes/${selectedNote.id}`, { method: "DELETE" });
      setNotes(notes.filter(n => n.id !== selectedNote.id));
      setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg dark:bg-bg-dark rounded-lg shadow overflow-hidden">
      <div className="w-full px-8 pt-4">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-primary">Notas</h1>
      <div className="mb-4 relative w-64">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
          placeholder="Buscar por título, contenido, tags..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
      </div>
        <div className="flex h-[calc(100vh-120px)]">
          <NoteList
            notes={notes.filter(n => {
              const searchLower = search.toLowerCase();
              return (
                n.title?.toLowerCase().includes(searchLower) ||
                n.content?.toLowerCase().includes(searchLower) ||
                (Array.isArray(n.tags) ? n.tags.join(",").toLowerCase().includes(searchLower) : false)
              );
            })}
            selectedId={selectedId}
            onSelect={setSelectedId}
            tiposNotas={tiposNotas}
            onNew={handleNew}
          />
          <NoteViewer
            note={isCreating ? newNote : selectedNote}
            onEdit={handleEdit}
            onDelete={handleDelete}
            tiposNotas={tiposNotas}
            recursos={recursos}
            isEditing={isEditing}
            isCreating={isCreating}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
