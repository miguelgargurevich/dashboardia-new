import { FiClock, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { useState } from "react";

export default function UpcomingEventsPanel({ events, tiposEventos }: { events: any[], tiposEventos?: any[] }) {
  const [expanded, setExpanded] = useState<number[]>([]);
  // Filtra eventos próximos (hoy o futuro)
  const now = new Date();
  const upcoming = events
    .filter((ev: any) => {
      const date = ev.startDate ? new Date(ev.startDate) : null;
      return date && date > now;
    })
    .sort((a: any, b: any) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 5);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-extrabold text-primary dark:text-accent flex items-center gap-2 mb-4 tracking-tight">
        <FiClock className="text-2xl text-primary dark:text-accent" /> Próximos eventos
      </h2>
      <div className="space-y-4">
        {upcoming.length > 0 ? (
          upcoming.map((ev: any, idx: number) => {
            const start = new Date(ev.startDate);
            const diffHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
            const isSoon = diffHours <= 48;
            const isWeekend = start.getDay() === 0 || start.getDay() === 6;
            const isAlert = isSoon || isWeekend;
            const tipo = tiposEventos?.find((t: any) => t.id === ev.eventType || (typeof ev.eventType === 'string' && typeof t.nombre === 'string' && t.nombre.toLowerCase() === ev.eventType.toLowerCase()));
            // Icono: clase Tailwind o color hex
            let iconClass = "text-2xl";
            if (tipo?.color && !tipo?.color.startsWith('#') && tipo?.color.includes('text-')) {
              iconClass += ` ${tipo.color}`;
            }
            let iconStyle = {};
            if (tipo?.color && tipo?.color.startsWith('#')) {
              iconStyle = { color: tipo.color };
            }
            let iconElement = null;
            if (tipo?.icono) {
              if (tipo.icono.startsWith('fa-')) {
                iconElement = <i className={`fa ${tipo.icono} ${iconClass}`} style={iconStyle}></i>;
              } else {
                iconElement = <span className={iconClass} style={iconStyle}>{tipo.icono}</span>;
              }
            }
            return (
              <div
                key={ev.id ?? idx}
                className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
                style={{ overflow: 'hidden' }}
              >
                <button
                  className={`flex items-center gap-3 w-full text-left px-5 py-4 focus:outline-none transition-colors duration-150 ${expanded.includes(idx) ? "bg-primary/10 dark:bg-accent/10" : ""}`}
                  onClick={() => {
                    setExpanded((expanded: number[]) =>
                      expanded.includes(idx)
                        ? expanded.filter((i: number) => i !== idx)
                        : [...expanded, idx]
                    );
                  }}
                >
                  {iconElement}
                  <span className={`font-bold text-base ${tipo?.color || 'text-primary dark:text-accent'} truncate max-w-xs`}>{ev.title}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto whitespace-nowrap">{start.toLocaleString()}</span>
                  {isAlert && (
                    <span className="flex items-center gap-1 ml-2">
                      <FiAlertCircle className="text-lg text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-red-600 dark:text-red-400">Alerta</span>
                    </span>
                  )}
                </button>
                {expanded.includes(idx) && (
                  <div className="px-5 pb-4 bg-gray-50 dark:bg-gray-900/80 rounded-b-xl border-t border-gray-100 dark:border-gray-800">
                    {isSoon && (
                      <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Este evento es muy próximo (menos de 48 horas).
                      </div>
                    )}
                    {isWeekend && (
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        El evento cae en fin de semana y debe reprogramarse.
                      </div>
                    )}
                    {/* Detalle del evento */}
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-200 space-y-1">
                      <div><span className="font-semibold">Inicio:</span> {start.toLocaleString()}</div>
                      <div><span className="font-semibold">Fin:</span> {ev.endDate ? new Date(ev.endDate).toLocaleString() : "-"}</div>
                      {ev.location && <div><span className="font-semibold">Ubicación:</span> {ev.location}</div>}
                      {ev.codigoDana && <div><span className="font-semibold">Código Dana:</span> {ev.codigoDana}</div>}
                      {ev.description && <div className="mt-1"><span className="font-semibold">Descripción:</span> {ev.description}</div>}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-400 dark:text-gray-500">No hay próximos eventos.</div>
        )}
      </div>
    </div>
  );
}
