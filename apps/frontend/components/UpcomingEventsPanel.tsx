import { FiClock, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { useState } from "react";

export default function UpcomingEventsPanel({ events }: { events: any[] }) {
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
      <h2 className="text-lg font-bold text-primary dark:text-accent flex items-center gap-2 mb-2">
        <FiClock className="text-xl text-primary dark:text-accent" /> Próximos eventos
      </h2>
      <div className="space-y-3">
        {upcoming.length > 0 ? (
          upcoming.map((ev: any, idx: number) => {
            const start = new Date(ev.startDate);
            const diffHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
            const isSoon = diffHours <= 48;
            const isWeekend = start.getDay() === 0 || start.getDay() === 6;
            const isAlert = isSoon || isWeekend;
            return (
              <div key={ev.id ?? idx} className="bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 flex flex-col">
                <button
                  className={`flex items-center gap-2 w-full text-left px-3 py-3 focus:outline-none ${expanded.includes(idx) ? "bg-primary/10" : ""}`}
                  onClick={() => {
                    setExpanded((expanded: number[]) =>
                      expanded.includes(idx)
                        ? expanded.filter((i: number) => i !== idx)
                        : [...expanded, idx]
                    );
                  }}
                >
                  <FiCalendar className="text-primary" />
                  <span className="font-semibold text-primary dark:text-accent">{ev.title}</span>
                  <span className="text-xs text-gray-500 ml-auto">{start.toLocaleString()}</span>
                  {isAlert && (
                    <span className="flex items-center gap-1 ml-2">
                      <FiAlertCircle className="text-lg text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-red-600 dark:text-red-400">Alerta</span>
                    </span>
                  )}
                </button>
                {expanded.includes(idx) && (
                  <div className="px-3 pb-3">
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
                    <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
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
          <div className="text-sm text-gray-400">No hay próximos eventos.</div>
        )}
      </div>
    </div>
  );
}
