"use client";
import { useState, useEffect } from "react";
import { FiCalendar, FiEdit, FiTrash2, FiPlus, FiFile, FiTag, FiSearch, FiMapPin } from "react-icons/fi";
import { getTiposEventos, getRecursos } from "../../config/tipos";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

function EventList({ events, selectedId, onSelect, tiposEventos, onNew, search, onSearch }: any) {
  return (
    <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 h-full min-h-0 flex flex-col pl-8">
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
                <span className="font-semibold text-gray-500 dark:text-gray-400">{event.title}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-200">{(() => {
                  if (!event.startDate) return "";
                  // Forzar local date usando los componentes de la fecha ISO
                  const [year, month, day] = event.startDate.slice(0,10).split("-");
                  return `${day}/${month}/${year}`;
                })()}</div>
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
  const safeTiposEventos = Array.isArray(tiposEventos) ? tiposEventos : [];
  useEffect(() => {
    // Find eventType id if event.eventType is nombre
    let eventTypeId = event?.eventType;
    if (eventTypeId && safeTiposEventos.length) {
      const foundTipo = safeTiposEventos.find(t => t.id === eventTypeId || (typeof eventTypeId === 'string' && typeof t.nombre === 'string' && t.nombre.toLowerCase() === eventTypeId.toLowerCase()));
      eventTypeId = foundTipo ? foundTipo.id : "";
    }
    setEditData({
      ...event,
      eventType: eventTypeId || "",
      relatedResources: Array.isArray(event?.relatedResources) ? event.relatedResources : [],
    });
  }, [event, safeTiposEventos]);
  const tipo = tiposEventos.find((t: any) => t.id === (isEditing || isCreating ? editData?.eventType : event?.eventType) || (typeof (isEditing || isCreating ? editData?.eventType : event?.eventType) === 'string' && typeof t.nombre === 'string' && t.nombre.toLowerCase() === (isEditing || isCreating ? editData?.eventType : event?.eventType).toLowerCase()));
  // Color hexadecimal para el icono
  let iconColor = tipo?.color || '';
  if (isEditing || isCreating) {
    // Asegurar que editData.relatedResources siempre sea un array
    const relatedResourcesArr = Array.isArray(editData?.relatedResources) ? editData.relatedResources : [];
    return (
      <div className="flex-1 p-8 overflow-y-auto">
        <form className="space-y-4 max-w-xl" onSubmit={async e => {
          e.preventDefault();
          await onSave(editData);
        }}>
          {/* Título con icono y borde igual que notas/recursos */}
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.title || ""}
              onChange={e => setEditData({ ...editData, title: e.target.value })}
              placeholder="Título"
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
              value={editData?.description || ""}
              onChange={e => setEditData({ ...editData, description: e.target.value })}
              rows={4}
              placeholder="Descripción"
            />
            <FiFile className="absolute left-3 top-4 text-accent" />
          </div>
          <div className="relative mb-4 w-64">
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10 appearance-none"
              style={{ height: '42px' }}
              value={editData?.eventType || ""}
              onChange={e => setEditData({ ...editData, eventType: e.target.value })}
              required
            >
              <option value="">Tipo de evento</option>
              {tiposEventos.map((t: any) => (
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
          <div className="relative mb-4 w-64">
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.startDate ? editData.startDate.slice(0,10) : (isCreating ? new Date().toISOString().slice(0,10) : "")}
              onChange={e => {
                const start = e.target.value;
                let end = "";
                if (start) {
                  end = start;
                }
                setEditData({ ...editData, startDate: start, endDate: end });
              }}
              required
            />
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          {/* Campo oculto para endDate */}
          <input type="hidden" value={editData?.endDate || ""} />

          {/* Campos adicionales */}
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.location || ""}
              onChange={e => setEditData({ ...editData, location: e.target.value })}
              placeholder="Ubicación"
            />
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.modo || ""}
              onChange={e => setEditData({ ...editData, modo: e.target.value })}
              placeholder="Modo (ej: Presencial, Virtual)"
            />
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.validador || ""}
              onChange={e => setEditData({ ...editData, validador: e.target.value })}
              placeholder="Validador"
            />
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.codigoDana || ""}
              onChange={e => setEditData({ ...editData, codigoDana: e.target.value })}
              placeholder="Código Dana"
            />
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.diaEnvio || ""}
              onChange={e => setEditData({ ...editData, diaEnvio: e.target.value })}
              placeholder="Día de envío"
            />
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
          <div className="relative mb-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors pl-10"
              value={editData?.recurrencePattern || ""}
              onChange={e => setEditData({ ...editData, recurrencePattern: e.target.value })}
              placeholder="Recurrencia (ej: Semanal, Mensual)"
            />
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>

          <div>
            <label className="block font-semibold mb-2">Recursos relacionados</label>
            <div className="flex flex-wrap gap-2">
              {recursos.map((r: any) => (
                <button
                  type="button"
                  key={r.id}
                  className={`px-2 py-1 rounded border flex items-center gap-1 ${relatedResourcesArr.includes(r.id) ? "bg-primary text-white" : "bg-gray-100"}`}
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
  if (!event) return <div className="flex-1 flex items-center justify-center text-gray-400">Selecciona un evento</div>;
  // Formatear fecha de inicio a dd/mm/yyyy
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Forzar local date usando los componentes de la fecha ISO
    const [year, month, day] = dateStr.slice(0,10).split("-");
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="flex-1 p-8 overflow-y-auto" style={tipo?.color && tipo.color.startsWith('#') ? { borderLeft: `6px solid ${tipo.color}` } : {}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-400 flex items-center gap-2">
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
      <div className="mb-4 text-gray-700 dark:text-gray-100 whitespace-pre-line">{event.description}</div>
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
        <span className="font-semibold text-gray-700 dark:text-white">Fecha:</span> <span className="text-gray-700 dark:text-white">{formatDate(event.startDate)}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700 dark:text-white">Recurrencia:</span> <span className="text-gray-700 dark:text-white">{event.recurrencePattern}</span>
      </div>
      <div className="mb-4 text-gray-700 dark:text-gray-100">
        <span className="font-semibold">Recursos relacionados:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {renderRelatedResources(event.relatedResources, tipo, recursos)}
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
    // Si es objeto recurso, mostrar título
    if (isResourceObject(r)) {
      return (
        <a
          key={r.url || r.titulo || i}
          href={r.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={"px-2 py-1 rounded flex items-center gap-1 hover:underline bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"}
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
          {r.titulo || r.url}
        </a>
      );
    }
    // Si es string (ID), buscar en recursos
    if (typeof r === 'string') {
      const recurso = recursos && Array.isArray(recursos) ? recursos.find((x: any) => x.id === r) : null;
      const titulo = recurso ? (recurso.titulo || recurso.nombre || recurso.url || r) : r;
      const url = recurso?.url || '#';
      return (
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
      );
    }
    return null;
  });
}

export default function EventosPage() {
  const handleDelete = async () => {
    if (!selectedEvent) return;
    if (confirm("¿Seguro que quieres eliminar este evento?")) {
      await fetch(`${API_BASE}/events/${selectedEvent.id}`, { method: "DELETE" });
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setSelectedId(null);
    }
  };
  const [events, setEvents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [tiposEventos, setTiposEventos] = useState<any[]>([]);
  const [recursos, setRecursos] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState<any>({ title: "", description: "", eventType: "", location: "", startDate: "", endDate: "", recurrencePattern: "", relatedResources: [] });
  const [search, setSearch] = useState("");
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const [month, setMonth] = useState(currentMonth);

  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then(res => res.json())
      .then(data => {
        // Ordenar por fecha de inicio ascendente
        const sorted = [...data].sort((a, b) => {
          if (!a.startDate || !b.startDate) return 0;
          return a.startDate.localeCompare(b.startDate);
        });
        setEvents(sorted);
      });
    getTiposEventos().then(setTiposEventos);
    getRecursos().then(setRecursos);
  }, []);

  useEffect(() => {
    setSelectedEvent(events.find(e => e.id === selectedId) || null);
    setIsEditing(false);
    // Solo desactivar isCreating si no está en modo creación
    if (!isCreating) {
      setIsCreating(false);
    }
  }, [selectedId, events]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => { setIsEditing(false); setIsCreating(false); };
  const handleSave = async (editData: any) => {
    // Sanitize payload: only send correct fields, avoid duplicates
    const safeTiposEventos = Array.isArray(tiposEventos) ? tiposEventos : [];
    // Buscar el nombre del tipo de evento (enum) para el payload
    const tipoEventoObj = safeTiposEventos.find(t => t.id === editData.eventType || t.nombre === editData.eventType);
    // Forzar mayúscula inicial para el enum
    let eventTypeEnum = tipoEventoObj?.enum || tipoEventoObj?.nombre || editData.eventType || "";
    if (eventTypeEnum) {
      eventTypeEnum = eventTypeEnum.charAt(0).toUpperCase() + eventTypeEnum.slice(1);
    }
    // Fecha actual en formato yyyy-mm-dd
    const todayStr = new Date().toISOString().slice(0,10);
    const startDateStr = editData.startDate && editData.startDate.length === 10 ? editData.startDate : todayStr;
    const endDateStr = editData.endDate && editData.endDate.length === 10 ? editData.endDate : startDateStr;
    const payload = {
      title: editData.title || "",
      description: editData.description || "",
      eventType: eventTypeEnum,
      location: editData.location || "",
      startDate: new Date(startDateStr + 'T00:00:00.000Z').toISOString(),
      endDate: new Date(endDateStr + 'T01:00:00.000Z').toISOString(),
      recurrencePattern: editData.recurrencePattern || "",
      relatedResources: Array.isArray(editData.relatedResources)
        ? editData.relatedResources.map((r: any) => typeof r === 'object' && r.id ? r.id : r)
        : [],
      // Add all possible required fields with default values
      codigoDana: editData.codigoDana || "",
      diaEnvio: editData.diaEnvio || "",
      modo: editData.modo || "",
      validador: editData.validador || "",
    };
    console.log("[handleSave] Payload:", payload);
    if (isCreating) {
      try {
        const res = await fetch(`${API_BASE}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log("[handleSave] Response status:", res.status);
        const text = await res.text();
        console.log("[handleSave] Response text:", text);
        if (!res.ok) {
          alert("Error al crear evento: " + text);
          return;
        }
        const created = JSON.parse(text);
        setEvents([...events, created]);
        setSelectedId(created.id);
        setIsCreating(false);
      } catch (err) {
        console.error("[handleSave] Error:", err);
        alert("Error al crear evento: " + err);
      }
    } else if (isEditing && selectedEvent) {
      try {
        const res = await fetch(`${API_BASE}/events/${selectedEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log("[handleSave] Response status:", res.status);
        const text = await res.text();
        console.log("[handleSave] Response text:", text);
        if (!res.ok) {
          alert("Error al actualizar evento: " + text);
          return;
        }
        const updated = JSON.parse(text);
        setEvents(events.map(e => e.id === updated.id ? updated : e));
        setSelectedId(updated.id);
        setIsEditing(false);
      } catch (err) {
        console.error("[handleSave] Error:", err);
        alert("Error al actualizar evento: " + err);
      }
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
              value={month}
              onChange={e => setMonth(e.target.value)}
            >
              <option value="">Todos los meses</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={String(i+1).padStart(2, '0')}>{new Date(2025, i).toLocaleString('es-ES', { month: 'long' })}</option>
              ))}
            </select>
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        <EventList
          events={events
            .filter(e => {
              const searchLower = search.toLowerCase();
              const matchesSearch =
                e.title?.toLowerCase().includes(searchLower) ||
                e.description?.toLowerCase().includes(searchLower) ||
                (Array.isArray(e.tags) ? e.tags.join(",").toLowerCase().includes(searchLower) : false);
              // Mostrar solo eventos del mes seleccionado
              const matchesMonth = month ? (e.startDate && e.startDate.slice(5,7) === month) : true;
              return matchesSearch && matchesMonth;
            })
            .sort((a, b) => {
              if (!a.startDate || !b.startDate) return 0;
              return a.startDate.localeCompare(b.startDate);
            })
          }
          selectedId={selectedId}
          onSelect={setSelectedId}
          tiposEventos={tiposEventos}
          onNew={handleNew}
          search={search}
          onSearch={setSearch}
        />
        {/* Inyectar recursos en renderRelatedResources para mostrar nombre/título */}
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
