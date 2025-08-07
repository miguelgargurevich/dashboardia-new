import { FaTag, FaRegStickyNote } from "react-icons/fa";

export default function NoteCard({ note }: any) {
  return (
    <div className="bg-white dark:bg-darkBg rounded-xl shadow-md p-5 flex flex-col gap-2 border-l-4" style={{ borderColor: note.color || '#2563eb' }}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{note.icono || <FaRegStickyNote />}</span>
        <h3 className="font-bold text-lg text-primary dark:text-accent flex-1">{note.title}</h3>
        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent uppercase">{note.tipo}</span>
      </div>
      <div className="text-gray-700 dark:text-gray-200 text-sm">{note.content}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        {note.tags?.map((tag: string) => (
          <span key={tag} className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-secondary/10 text-secondary dark:bg-secondary/20">
            <FaTag /> {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {note.keyPoints?.map((kp: string) => (
          <span key={kp} className="px-2 py-1 text-xs rounded bg-accent/10 text-accent dark:bg-accent/20">{kp}</span>
        ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">Prioridad: {note.priority}</span>
        <span className="text-xs text-gray-400">Estado: {note.status}</span>
      </div>
    </div>
  );
}
