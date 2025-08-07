import { FaCalendarAlt, FaChalkboardTeacher, FaTools } from "react-icons/fa";

const iconMap: any = {
  'Reunión': <FaCalendarAlt />,
  'Capacitación': <FaChalkboardTeacher />,
  'Mantenimiento': <FaTools />,
};

export default function EventCard({ event }: any) {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl shadow-md p-5 flex flex-col gap-2 border-l-4" style={{ borderColor: event.color || '#f59e42' }}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{iconMap[event.eventType] || <FaCalendarAlt />}</span>
        <h3 className="font-bold text-lg text-primary dark:text-accent flex-1">{event.title}</h3>
        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent uppercase">{event.eventType}</span>
      </div>
      <div className="text-gray-700 dark:text-gray-200 text-sm">{event.description}</div>
      <div className="flex gap-2 mt-2">
        <span className="px-2 py-1 text-xs rounded bg-secondary/10 text-secondary dark:bg-secondary/20">{event.recurrencePattern}</span>
        <span className="px-2 py-1 text-xs rounded bg-accent/10 text-accent dark:bg-accent/20">{event.location}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400 dark:text-gray-500">Inicio: {event.startDate?.slice(0, 16).replace('T', ' ')}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">Fin: {event.endDate?.slice(0, 16).replace('T', ' ')}</span>
      </div>
    </div>
  );
}
