import { FaLink, FaBook, FaVideo } from "react-icons/fa";

const iconMap: any = {
  Manual: <FaBook />,
  Video: <FaVideo />,
  Enlace: <FaLink />,
};

export default function ResourceCard({ resource }: any) {
  return (
    <div className="bg-white dark:bg-darkBg rounded-xl shadow-md p-5 flex flex-col gap-2 border-l-4" style={{ borderColor: resource.color || '#10b981' }}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{iconMap[resource.tipo] || <FaBook />}</span>
        <h3 className="font-bold text-lg text-primary dark:text-accent flex-1">{resource.titulo}</h3>
        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent uppercase">{resource.tipo}</span>
      </div>
      <div className="text-gray-700 dark:text-gray-200 text-sm">{resource.descripcion}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        {resource.tags?.map((tag: string) => (
          <span key={tag} className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-secondary/10 text-secondary dark:bg-secondary/20">
            #{tag}
          </span>
        ))}
      </div>
      {resource.url && (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline mt-2">Ver recurso</a>
      )}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">Categoría: {resource.categoria}</span>
        <span className="text-xs text-gray-400">Fecha: {resource.fechaCarga?.slice(0, 10)}</span>
      </div>
    </div>
  );
}
