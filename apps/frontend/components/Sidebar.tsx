import { FaStickyNote, FaBook, FaCalendarAlt, FaUser, FaCog } from "react-icons/fa";
import Link from "next/link";

const menu = [
  { label: "Dashboard", icon: <FaStickyNote />, href: "/dashboard", type: "route" },
  { label: "Notas", icon: <FaStickyNote />, href: "/notas", type: "route" },
  { label: "Recursos", icon: <FaBook />, href: "/recursos", type: "route" },
  { label: "Eventos", icon: <FaCalendarAlt />, href: "/eventos", type: "route" },
  { label: "Usuarios", icon: <FaUser />, href: "/usuarios", type: "route" },
  { label: "Configuración", icon: <FaCog />, href: "/config", type: "route" },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-white dark:bg-gray-950 shadow-lg flex flex-col py-8 px-4 z-40 border-r border-gray-200 dark:border-gray-800">
      <div className="mb-8 flex items-center">
        <span className="text-xl font-bold px-2 py-1 rounded bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary">Dashboard IA</span>
        <span className="text-[10px] px-1 py-0.5 rounded bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary ml-2 align-middle">v1.0</span>
      </div>

      <nav className="flex flex-col gap-4">
        {menu.map((item) => (
          <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-accent/10 text-gray-700 dark:text-gray-200 font-medium transition-colors">
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
