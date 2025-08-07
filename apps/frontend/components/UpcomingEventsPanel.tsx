export default function UpcomingEventsPanel({ events }: { events: any[] }) {
  // Filtra eventos próximos (hoy o futuro)
  const now = new Date();
  const upcoming = events.filter(ev => {
    const date = ev.startDate ? new Date(ev.startDate) : null;
    return date && date >= now;
  }).sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateA - dateB;
  });

  return (
    <div className="bg-white dark:bg-darkBg rounded-lg shadow p-4">
      <h2 className="text-lg font-bold text-primary dark:text-accent mb-2">Próximos eventos</h2>
      {upcoming.length === 0 ? (
        <div className="text-gray-400">No hay eventos próximos.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {upcoming.slice(0, 8).map((ev, idx) => (
            <li key={ev.id ?? idx} className="border-b pb-2 last:border-b-0">
              <div className="font-semibold text-secondary">{ev.title || ev.titulo || "Evento"}</div>
              <div className="text-xs text-gray-500">{new Date(ev.date || ev.fecha).toLocaleString("es", { dateStyle: "medium", timeStyle: "short" })}</div>
              {ev.description && <div className="text-xs text-gray-400">{ev.description}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
