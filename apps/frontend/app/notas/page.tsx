"use client";
import { useState, useEffect } from "react";
import { FiTag, FiEdit, FiTrash2, FiPlus, FiFile } from "react-icons/fi";
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
        {(Array.isArray(notes) ? notes : []).map((note: any) => {
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
                <span className="font-semibold text-primary dark:text-primary">{note.title}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{tipo ? tipo.nombre : note.tipo}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NoteViewer({ note, onEdit, onDelete, tiposNotas, isEditing, onSave, onCancel, isCreating }: any) {
  const [editData, setEditData] = useState<any>(note);
  useEffect(() => { setEditData(note); }, [note]);
  const tipo = (Array.isArray(tiposNotas) ? tiposNotas : []).find((t: any) => t.id === (isEditing || isCreating ? editData?.tipo : note?.tipo) || t.nombre === (isEditing || isCreating ? editData?.tipo : note?.tipo));
  if (isEditing || isCreating) {
    return (
      <div className="flex-1 p-8">
        <form className="space-y-4 max-w-xl" onSubmit={e => {
          e.preventDefault();
          onSave(editData);
        }}>
          <div className="flex items-center gap-2 mb-4">
            <input
              className="text-2xl font-bold flex-1 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              value={editData?.title || ""}
              onChange={e => setEditData({ ...editData, title: e.target.value })}
              placeholder="Título"
              required
            />
           
          </div>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            value={editData?.content || ""}
            onChange={e => setEditData({ ...editData, content: e.target.value })}
            rows={5}
            placeholder="Contenido"
            required
          />
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none transition-colors"
            value={editData?.tipo || ""}
            onChange={e => setEditData({ ...editData, tipo: e.target.value })}
            required
          >
            <option value="">Tipo de nota</option>
            {tiposNotas.map((t: any) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <input
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            value={editData?.tags?.join(", ") || ""}
            onChange={e => setEditData({ ...editData, tags: e.target.value.split(",").map((tag: string) => tag.trim()) })}
            placeholder="Tags (separados por coma)"
          />
          <div className="flex gap-2">
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
    <div className="flex-1 p-8" style={borderStyle}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary dark:text-primary flex items-center gap-2">
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
        <span className="font-semibold">Recursos relacionados:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {note.relatedResources?.length > 0 ? note.relatedResources.map((r: string, i: number) => (
            <span key={r + i} className="px-2 py-1 rounded flex items-center gap-1"
              style={tipo?.color ? { border: `1px solid ${tipo.color}`, background: tipo.color + '22', color: tipo.color } : {}}>
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
            </span>
          )) : <span className="text-xs text-gray-400 dark:text-gray-400">Sin recursos</span>}
        </div>
      </div>
      <div className="mb-4 text-gray-700 dark:text-gray-100">
        <span className="font-semibold">Tags:</span> {note.tags?.join(", ")}
      </div>
      <div className="mb-4 text-gray-700 dark:text-gray-100">
        <span className="font-semibold">Estado:</span> {note.status}
      </div>
      <div className="mb-4 text-gray-700 dark:text-gray-100">
        <span className="font-semibold">Prioridad:</span> {note.priority}
      </div>
    </div>
  );
}

export default function NotasRoute() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [tiposNotas, setTiposNotas] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState<any>({ title: "", content: "", tipo: "", tags: [] });

  useEffect(() => {
    fetch(`${API_BASE}/notes`)
      .then(res => res.json())
      .then(setNotes);
    getTiposNotas().then(setTiposNotas);
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
    if (isCreating) {
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const created = await res.json();
      setNotes([...notes, created]);
      setSelectedId(created.id);
      setIsCreating(false);
    } else {
      const res = await fetch(`${API_BASE}/notes/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const updated = await res.json();
      setNotes(notes.map(n => n.id === updated.id ? updated : n));
      setSelectedNote(updated);
      setIsEditing(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedNote) return;
    if (confirm("¿Seguro que quieres eliminar esta nota?")) {
      await fetch(`${API_BASE}/notes/${selectedNote.id}`, { method: "DELETE" });
      setNotes(notes.filter(n => n.id !== selectedNote.id));
      setSelectedId(null);
    }
  };
  const handleNew = () => {
    setNewNote({ title: "", content: "", tipo: "", tags: [] });
    setSelectedId(null);
    setIsCreating(true);
  };

  return (
    <div className="flex flex-col h-screen bg-bg dark:bg-bg-dark rounded-lg shadow overflow-hidden">
      <div className="w-full px-8 pt-4">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-primary">Notas</h1>
      </div>
      <div className="flex flex-1">
        <NoteList notes={notes} selectedId={selectedId} onSelect={setSelectedId} tiposNotas={tiposNotas} onNew={handleNew} />
        <NoteViewer
          note={isCreating ? newNote : selectedNote}
          onEdit={handleEdit}
          onDelete={handleDelete}
          tiposNotas={tiposNotas}
          isEditing={isEditing}
          isCreating={isCreating}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
