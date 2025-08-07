import { useMemo, useState } from "react";

export default function Calendar({ events }: { events: any[] }) {
  // ...existing code...
  const [selectedDate, setSelectedDate] = useState<string>("");
  // Agrupa eventos por fecha (YYYY-MM-DD)
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    events.forEach(ev => {
      // Usar startDate como referencia
      const date = ev.startDate ? new Date(ev.startDate).toISOString().slice(0, 10) : "";
      if (!map[date]) map[date] = [];
      map[date].push(ev);
    });
    return map;
  }, [events]);

  // Genera los días del mes actual
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days: Array<{ day: number; date: string; events: any[] }> = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    days.push({ day: i, date: dateStr, events: grouped[dateStr] || [] });
  }

  // Componente para mostrar archivos relacionados
  function ResourceTag({ resourceId }: { resourceId: string }) {
    // Aquí podrías hacer un fetch al backend para obtener detalles del recurso si lo deseas
    // Por simplicidad, solo mostramos el ID
    return (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300">Archivo: {resourceId}</span>
    );
  }

  return (
    <div className="bg-white dark:bg-darkBg rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-primary dark:text-accent">Calendario de eventos</h2>
        <span className="text-sm text-gray-400">{today.toLocaleString("es", { month: "long", year: "numeric" })}</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(firstDay).keys()].map(i => <div key={"empty-"+i}></div>)}
        {days.map(({ day, date, events }) => (
          <button
            key={date}
            className={`border rounded h-16 w-full flex flex-col items-center justify-center cursor-pointer transition-all
              ${selectedDate === date ? "bg-primary text-white" : "bg-white dark:bg-darkBg text-gray-700 dark:text-gray-200"}
              ${events.length > 0 ? "border-primary" : "border-gray-200 dark:border-gray-700"}`}
            onClick={() => setSelectedDate(date)}
          >
            <span className="font-semibold">{day}</span>
            {events.length > 0 && <span className="text-xs text-primary dark:text-accent">{events.length} evento(s)</span>}
          </button>
        ))}
      </div>
      {/* Cards modernos para eventos del día seleccionado */}
      {selectedDate && grouped[selectedDate] && grouped[selectedDate].length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {grouped[selectedDate].map((ev, idx) => (
            <div key={ev.id ?? idx} className="bg-white dark:bg-darkBg rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mr-2">{ev.eventType}</span>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{ev.modo}</span>
                {ev.validador && <span className="px-2 py-1 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">{ev.validador}</span>}
              </div>
              <h3 className="text-lg font-bold mb-1 text-primary dark:text-accent">{ev.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{ev.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {ev.relatedResources && ev.relatedResources.length > 0 && ev.relatedResources.map((resId: string, i: number) => (
                  <ResourceTag key={resId ?? i} resourceId={resId} />
                ))}
              </div>
              <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Inicio: {new Date(ev.startDate).toLocaleString()}</span>
                <span>Fin: {new Date(ev.endDate).toLocaleString()}</span>
                {ev.location && <span>Ubicación: {ev.location}</span>}
                {ev.codigoDana && <span>Código Dana: {ev.codigoDana}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
