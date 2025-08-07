"use client";
import { useState, useEffect } from "react";
import { FiCalendar, FiEdit, FiTrash2, FiPlus, FiFile } from "react-icons/fi";
import { getTiposEventos, getRecursos } from "../../config/tipos";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

function EventList({ events, selectedId, onSelect, tiposEventos, onNew }: any) {
  return (
    <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 h-full min-h-0 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700">
        <h2 className="text-lg font-bold text-primary dark:text-primary">Eventos</h2>
        <button className="text-primary dark:text-primary flex items-center gap-1 font-semibold" onClick={onNew}><FiPlus className="text-primary dark:text-primary" /> Nuevo</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {events.map((event: any) => {
            const tipo = tiposEventos.find((t: any) => t.id === event.eventType || (typeof event.eventType === 'string' && typeof t.nombre === 'string' && t.nombre.toLowerCase() === event.eventType.toLowerCase()));
            // Extraer color hexadecimal
            let iconColor = tipo?.color || '';
            let iconElement = null;
            if (tipo && tipo.icono) {
              if (tipo.icono.startsWith('fa-')) {
                iconElement = <i className={`fa ${tipo.icono} text-base`} style={iconColor ? { color: iconColor } : {}}></i>;
              } else {
                iconElement = <span className="text-base" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>;
              }
            }
            return (
              <li key={event.id}
                  className={`cursor-pointer px-4 py-3 hover:bg-primary/10 dark:hover:bg-accent/10 ${selectedId === event.id ? "bg-primary/10 dark:bg-accent/10" : ""}`}
                  style={iconColor ? { borderLeft: `4px solid ${iconColor}` } : {}}
                  onClick={() => onSelect(event.id)}>
                <div className="flex items-center gap-2">
                  {iconElement && (
                    <span className="text-xl">{iconElement}</span>
                  )}
                  <span className="font-semibold text-primary dark:text-primary">{event.title}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{tipo ? tipo.nombre : event.eventType}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function EventViewer({ event, onEdit, onDelete, tiposEventos, recursos, isEditing, onSave, onCancel, isCreating }: any) {
  const [editData, setEditData] = useState<any>(event);
  useEffect(() => { setEditData(event); }, [event]);
  const tipo = tiposEventos.find((t: any) => t.id === (isEditing || isCreating ? editData?.eventType : event?.eventType) || (typeof (isEditing || isCreating ? editData?.eventType : event?.eventType) === 'string' && typeof t.nombre === 'string' && t.nombre.toLowerCase() === (isEditing || isCreating ? editData?.eventType : event?.eventType).toLowerCase()));
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
          className="text-2xl font-bold flex-1 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 transition-colors"
          value={editData?.title || ""}
          onChange={e => setEditData({ ...editData, title: e.target.value })}
          placeholder="Título"
          required
        />
            {tipo && tipo.icono && (
              tipo.icono.startsWith('fa-')
                ? <span className="text-2xl"><i className={`fa ${tipo.icono}`} style={iconColor ? { color: iconColor } : {}}></i></span>
                : <span className="text-2xl" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>
            )}
          </div>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:outline-none placeholder-gray-400 dark:placeholder-gray-300 transition-colors"
            value={editData?.description || ""}
            onChange={e => setEditData({ ...editData, description: e.target.value })}
            rows={4}
            placeholder="Descripción"
          />
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:outline-none transition-colors"
            value={editData?.eventType || ""}
            onChange={e => setEditData({ ...editData, eventType: e.target.value })}
            required
          >
            <option value="">Tipo de evento</option>
            {tiposEventos.map((t: any) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring text-gray-900 dark:text-white bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-300"
            value={editData?.recurrencePattern || ""}
            onChange={e => setEditData({ ...editData, recurrencePattern: e.target.value })}
            placeholder="Recurrencia (ej: Semanal, Mensual)"
          />
          <div>
            <label className="block font-semibold mb-2">Recursos relacionados</label>
            <div className="flex flex-wrap gap-2">
              {recursos.map((r: any) => (
                <button
                  type="button"
                  key={r.id}
                  className={`px-2 py-1 rounded border flex items-center gap-1 ${editData.relatedResources?.includes(r.id) ? "bg-primary text-white" : "bg-gray-100"}`}
                  onClick={() => setEditData({ ...editData, relatedResources: editData.relatedResources?.includes(r.id) ? editData.relatedResources.filter((x: any) => x !== r.id) : [...(editData.relatedResources || []), r.id] })}
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
  if (!event) return <div className="flex-1 flex items-center justify-center text-gray-400">Selecciona un evento</div>;
  return (
    <div className="flex-1 p-8" style={tipo?.color && tipo.color.startsWith('#') ? { borderLeft: `6px solid ${tipo.color}` } : {}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary dark:text-accent flex items-center gap-2">
          {tipo && tipo.icono && (
            tipo.icono.startsWith('fa-')
              ? <span className="text-2xl"><i className={`fa ${tipo.icono}`} style={iconColor ? { color: iconColor } : {}}></i></span>
              : <span className="text-2xl" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>
          )}
          {event.title}
        </h2>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 rounded bg-primary text-white hover:bg-primary/80"><FiEdit /></button>
          <button onClick={onDelete} className="p-2 rounded bg-red-500 text-white hover:bg-red-600"><FiTrash2 /></button>
        </div>
      </div>
      <div className="mb-4 text-gray-700 dark:text-white whitespace-pre-line">{event.description}</div>
      <div className="mb-4 flex items-center gap-2">
        <span className="font-semibold text-gray-700 dark:text-white">Tipo:</span>
        {tipo && tipo.icono && (
          tipo.icono.startsWith('fa-')
            ? <span className="text-xl"><i className={`fa ${tipo.icono}`} style={iconColor ? { color: iconColor } : {}}></i></span>
            : <span className="text-xl" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>
        )}
        <span className="text-gray-700 dark:text-white">{tipo ? tipo.nombre : event.eventType}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700 dark:text-white">Ubicación:</span> <span className="text-gray-700 dark:text-white">{event.location}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700 dark:text-white">Inicio:</span> <span className="text-gray-700 dark:text-white">{event.startDate}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700 dark:text-white">Fin:</span> <span className="text-gray-700 dark:text-white">{event.endDate}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700 dark:text-white">Recurrencia:</span> <span className="text-gray-700 dark:text-white">{event.recurrencePattern}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700 dark:text-white">Recursos relacionados:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {event.relatedResources?.length > 0 ? event.relatedResources.map((rid: string, i: number) => {
            const r = recursos.find((x: any) => x.id === rid);
            return r ? <span key={rid} className="px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 flex items-center gap-1"><FiFile /> {r.titulo || r.nombre}</span> : null;
          }) : <span className="text-xs text-gray-400 dark:text-gray-400">Sin recursos</span>}
        </div>
      </div>
    </div>
  );
}

export default function EventosPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [tiposEventos, setTiposEventos] = useState<any[]>([]);
  const [recursos, setRecursos] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState<any>({ title: "", description: "", eventType: "", location: "", startDate: "", endDate: "", recurrencePattern: "", relatedResources: [] });

  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then(res => res.json())
      .then(setEvents);
    getTiposEventos().then(setTiposEventos);
    getRecursos().then(setRecursos);
  }, []);

  useEffect(() => {
    setSelectedEvent(events.find(e => e.id === selectedId) || null);
    setIsEditing(false);
    setIsCreating(false);
  }, [selectedId, events]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => { setIsEditing(false); setIsCreating(false); };
  const handleSave = async (editData: any) => {
    if (isCreating) {
      const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const created = await res.json();
      setEvents([...events, created]);
      setSelectedId(created.id);
      setIsCreating(false);
    } else {
      const res = await fetch(`${API_BASE}/events/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const updated = await res.json();
      setEvents(events.map(e => e.id === updated.id ? updated : e));
      setSelectedEvent(updated);
      setIsEditing(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedEvent) return;
    if (confirm("¿Seguro que quieres eliminar este evento?")) {
      await fetch(`${API_BASE}/events/${selectedEvent.id}`, { method: "DELETE" });
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setSelectedId(null);
    }
  };
  const handleNew = () => {
    setNewEvent({ title: "", description: "", eventType: "", location: "", startDate: "", endDate: "", recurrencePattern: "", relatedResources: [] });
    setSelectedId(null);
    setIsCreating(true);
  };

  return (
    <div className="flex flex-col h-screen min-h-0 bg-bg dark:bg-bg-dark rounded-lg shadow overflow-hidden">
      <div className="w-full px-8 pt-4">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-primary">Eventos</h1>
      </div>
      <div className="flex flex-1 min-h-0">
        <EventList events={events} selectedId={selectedId} onSelect={setSelectedId} tiposEventos={tiposEventos} onNew={handleNew} />
        <EventViewer
          event={isCreating ? newEvent : selectedEvent}
          onEdit={handleEdit}
          onDelete={handleDelete}
          tiposEventos={tiposEventos}
          recursos={recursos}
          isEditing={isEditing}
          isCreating={isCreating}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
