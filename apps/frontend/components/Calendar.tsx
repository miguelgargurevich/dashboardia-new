import { useMemo, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FiAlertCircle, FiClock, FiFile, FiUserCheck, FiTag, FiMapPin } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function Calendar({ events, tiposEventos, recursos }: { events: any[], tiposEventos?: any[], recursos?: any[] }) {

  const today = new Date();
  // Formato local YYYY-MM-DD
  function formatDateLocal(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const todayStr = formatDateLocal(today);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  // Agrupa eventos por fecha (YYYY-MM-DD) usando el string ISO para evitar desfase de zona horaria
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};
    events.forEach(ev => {
      let date = "";
      if (ev.startDate) {
        // Si es string ISO, usar los primeros 10 caracteres
        date = typeof ev.startDate === 'string' ? ev.startDate.slice(0, 10) : formatDateLocal(new Date(ev.startDate));
      }
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
    const dateObj = new Date(currentYear, currentMonth, i);
    const dateStr = formatDateLocal(dateObj);
    days.push({ day: i, date: dateStr, events: grouped[dateStr] || [] });
  }

  // Renderizado seguro de recursos relacionados (igual que Notas/Eventos)
  function renderRelatedResources(relatedResources: any[], recursos: any[]) {
    if (!Array.isArray(relatedResources) || relatedResources.length === 0) {
      return <span className="text-xs text-gray-400 dark:text-gray-400">Sin recursos</span>;
    }
    return relatedResources.map((r: any, i: number) => {
      // Si es objeto recurso, mostrar título y hacer clic si tiene url
      if (r && typeof r === 'object') {
        const titulo = r.titulo || r.nombre || r.title || r.url || r.id || r;
        if (r.url) {
          return (
            <a
              key={r.url || r.titulo || i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-800 hover:underline"
            >
              {titulo}
            </a>
          );
        } else {
          return (
            <span
              key={r.titulo || r.nombre || r.title || i}
              className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-800"
            >
              {titulo}
            </span>
          );
        }
      }
      // Si es string (ID), buscar en recursos
      if (typeof r === 'string' || typeof r === 'number') {
        const recurso = recursos && Array.isArray(recursos) ? recursos.find((x: any) => x.id === r || String(x.id) === String(r)) : null;
        const titulo = recurso ? (recurso.titulo || recurso.nombre || recurso.title || recurso.url || recurso.id) : r;
        const url = recurso?.url || '';
        return url ? (
          <a
            key={String(r) + '-' + i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-800 hover:underline"
          >
            {titulo}
          </a>
        ) : (
          <span
            key={String(r) + '-' + i}
            className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-800"
          >
            {titulo}
          </span>
        );
      }
      return null;
    });
  }

  return (
    <div className="bg-bg dark:bg-bg-dark rounded-lg shadow p-4">

      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-2xl text-primary dark:text-primary mr-2" />
          <h2 className="text-xl font-bold text-primary dark:text-primary">
            {(() => {
              const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
              return meses[currentMonth] + " " + currentYear;
            })()}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded-md text-primary dark:text-primary font-normal bg-transparent border-none shadow-none hover:bg-transparent focus:outline-none"
            onClick={() => {
              setCurrentMonth(m => m === 0 ? 11 : m - 1);
              if (currentMonth === 0) setCurrentYear(y => y - 1);
            }}
            aria-label="Mes anterior"
          >
            <FiChevronLeft className="text-lg" />
          </button>
          <button
            className="px-2 py-1 rounded-md text-primary dark:text-primary font-normal bg-transparent border-none shadow-none hover:bg-transparent focus:outline-none"
            onClick={() => {
              setCurrentMonth(today.getMonth());
              setCurrentYear(today.getFullYear());
              setSelectedDate(todayStr);
            }}
          >
            Hoy
          </button>
          <button
            className="px-2 py-1 rounded-md text-primary dark:text-primary font-normal bg-transparent border-none shadow-none hover:bg-transparent focus:outline-none"
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
        {days.map(({ day, date, events }) => {
          const isToday = date === todayStr;
          return (
            <button
              key={date}
              className={`border rounded h-16 w-full flex flex-col items-center justify-center cursor-pointer transition-all
                ${selectedDate === date ? "bg-primary text-white" : "bg-bg dark:bg-bg-dark text-gray-700 dark:text-gray-200"}
                ${events.length > 0 ? "border-primary" : "border-border dark:border-border-dark"}
              `}
              style={isToday ? { border: '2px solid #2563eb' } : {}}
              onClick={() => setSelectedDate(date)}
            >
              <span className={`font-semibold ${selectedDate === date ? "text-white" : ""}`}>{day}</span>
              {events.length > 0 && (
                <span className={`text-xs ${selectedDate === date ? "text-white" : "text-primary dark:text-primary"}`}>{events.length} evento(s)</span>
              )}
            </button>
          );
        })}
      </div>
      {/* Cards modernos para eventos del día seleccionado */}
      {selectedDate && grouped[selectedDate] && grouped[selectedDate].length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mt-10">
          {/* Cabecera de eventos del día */}
          <div className="mb-2">
            <h3 className="text-lg font-bold text-primary dark:text-primary">
              {(() => {
                // selectedDate es YYYY-MM-DD, extraer día y mes directamente
                const [year, month, day] = selectedDate.split("-");
                const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                const mesNombre = meses[parseInt(month, 10) - 1];
                return `Eventos del día ${day} de ${mesNombre}`;
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
                  <span className="flex items-center gap-1">
                    <FiClock /> Fecha: {(() => {
                      if (!ev.startDate) return "";
                      const [year, month, day] = ev.startDate.slice(0,10).split("-");
                      return `${day}/${month}/${year}`;
                    })()}
                  </span>
                  {ev.codigoDana && <span className="flex items-center gap-1"><FiFile /> Código Dana: {ev.codigoDana}</span>}
                  {ev.location && <span className="flex items-center gap-1"><FiMapPin /> Ubicación: {ev.location}</span>}

                </div>
                {/* Línea divisoria */}
                <hr className="my-3 border-gray-200 dark:border-gray-700" />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    {ev.relatedResources && ev.relatedResources.length > 0 && (
                      <>
                        <span className="font-semibold text-xs text-gray-500 dark:text-gray-400"></span>
                        {renderRelatedResources(ev.relatedResources, recursos || [])}
                      </>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-4 flex items-center gap-1">
                    <FiFile /> Recursos: {ev.relatedResources ? ev.relatedResources.length : 0}
                  </div>
                </div>
           
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          {/* @ts-ignore */}
          <FaRegCalendarAlt className="mx-auto text-3xl text-gray-600 mb-2" />
          <p className="text-gray-400 text-sm">No hay eventos programados para este día</p>
        </div>
      )}
    </div>
  );
}
