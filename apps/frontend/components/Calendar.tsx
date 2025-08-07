import { useMemo, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FiAlertCircle, FiClock, FiFile, FiUserCheck, FiTag, FiMapPin } from "react-icons/fi";

export default function Calendar({ events, tiposEventos }: { events: any[], tiposEventos?: any[] }) {
  // ...existing code...
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
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

  // Genera los días del mes seleccionado
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const days: Array<{ day: number; date: string; events: any[] }> = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    days.push({ day: i, date: dateStr, events: grouped[dateStr] || [] });
  }

  // Componente para mostrar archivos relacionados
  function ResourceTag({ resourceId }: { resourceId: string }) {
    // Aquí podrías hacer un fetch al backend para obtener detalles del recurso si lo deseas
    // Por simplicidad, solo mostramos el ID
    return (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-800">Archivo: {resourceId}</span>
    );
  }

  return (
    <div className="bg-bg dark:bg-bg-dark rounded-lg shadow p-4">

      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-2xl text-primary dark:text-primary mr-2" />
          <h2 className="text-xl font-bold text-primary dark:text-primary">Calendario de eventos</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-primary/10 transition-colors"
            onClick={() => {
              setCurrentMonth(m => m === 0 ? 11 : m - 1);
              if (currentMonth === 0) setCurrentYear(y => y - 1);
            }}
            aria-label="Mes anterior"
          >
            <FiChevronLeft className="text-lg" />
          </button>
          <button
            className="px-4 py-1 rounded-md bg-primary text-white border border-primary flex items-center gap-2 shadow hover:bg-primary/90 font-semibold transition-colors"
            onClick={() => {
              setCurrentMonth(today.getMonth());
              setCurrentYear(today.getFullYear());
              setSelectedDate(todayStr);
            }}
          >
            <FiCalendar className="text-base" /> Hoy
          </button>
          <button
            className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-primary/10 transition-colors"
            onClick={() => {
              setCurrentMonth(m => m === 11 ? 0 : m + 1);
              if (currentMonth === 11) setCurrentYear(y => y + 1);
            }}
            aria-label="Mes siguiente"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>
      {/* Cabeceras de los días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={d + i} className="text-xs font-bold text-center text-gray-500 dark:text-gray-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(firstDay).keys()].map(i => <div key={"empty-"+i}></div>)}
        {days.map(({ day, date, events }) => (
          <button
            key={date}
            className={`border rounded h-16 w-full flex flex-col items-center justify-center cursor-pointer transition-all
              ${selectedDate === date ? "bg-primary text-white" : "bg-bg dark:bg-bg-dark text-gray-700 dark:text-gray-200"}
              ${events.length > 0 ? "border-primary" : "border-border dark:border-border-dark"}`}
            onClick={() => setSelectedDate(date)}
          >
            <span className={`font-semibold ${selectedDate === date ? "text-white" : ""}`}>{day}</span>
            {events.length > 0 && (
            <span className={`text-xs ${selectedDate === date ? "text-white" : "text-primary dark:text-primary"}`}>{events.length} evento(s)</span>
            )}
          </button>
        ))}
      </div>
      {/* Cards modernos para eventos del día seleccionado */}
      {selectedDate && grouped[selectedDate] && grouped[selectedDate].length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-10">
          {/* Cabecera de eventos del día */}
          <div className="mb-2">
            <h3 className="text-lg font-bold text-primary dark:text-primary">
              {(() => {
                const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                const fecha = new Date(selectedDate);
                const dia = String(fecha.getDate()).padStart(2, "0");
                const mes = meses[fecha.getMonth()];
                return `Eventos del día ${dia} de ${mes}`;
              })()}
            </h3>
          </div>
          {grouped[selectedDate].map((ev, idx) => {
            const tipo = tiposEventos?.find((t: any) => t.id === ev.eventType || (typeof ev.eventType === 'string' && typeof t.nombre === 'string' && t.nombre.toLowerCase() === ev.eventType.toLowerCase()));
            let iconColor = tipo?.color || '';
            let iconElement = null;
            if (tipo?.icono) {
              if (tipo.icono.startsWith('fa-')) {
                iconElement = <i className={`fa ${tipo.icono} text-base`} style={iconColor ? { color: iconColor } : {}}></i>;
              } else {
                iconElement = <span className="text-base" style={iconColor ? { color: iconColor } : {}}>{tipo.icono}</span>;
              }
            }
            return (
              <div key={ev.id ?? idx} className="bg-bg dark:bg-bg-dark rounded-xl shadow-lg p-6 border border-border dark:border-border-dark w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-1 rounded flex items-center gap-1 text-xs font-semibold mr-2"
                    style={iconColor ? { color: iconColor, border: `1px solid ${iconColor}` } : {}}
                  >
                    {iconElement}
                    <span>{ev.eventType}</span>
                  </span>
                  <span className="px-2 py-1 rounded flex items-center gap-1 text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <FiClock className="text-gray-400" /> {ev.modo}
                  </span>
                  {ev.validador && (
                    <span className="px-2 py-1 rounded flex items-center gap-1 text-xs font-semibold bg-indigo-100 text-indigo-700">
                      <FiUserCheck className="text-indigo-500" /> {ev.validador}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2"
                  style={iconColor ? { color: iconColor } : {}}>
                  {iconElement}
                  {ev.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2 text-base">{ev.description}</p>
                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span className="flex items-center gap-1"><FiClock /> Inicio: {new Date(ev.startDate).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><FiClock /> Fin: {new Date(ev.endDate).toLocaleString()}</span>
                  {ev.codigoDana && <span className="flex items-center gap-1"><FiFile /> Código Dana: {ev.codigoDana}</span>}
                </div>
                {/* Línea divisoria */}
                <hr className="my-3 border-gray-200 dark:border-gray-700" />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-2">
                    {ev.relatedResources && ev.relatedResources.length > 0 && ev.relatedResources.map((resId: string, i: number) => (
                      <ResourceTag key={resId ?? i} resourceId={resId} />
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-4 flex items-center gap-1">
                    <FiFile /> Recursos: {ev.relatedResources ? ev.relatedResources.length : 0}
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                  {ev.location && <span className="flex items-center gap-1"><FiMapPin /> Ubicación: {ev.location}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
