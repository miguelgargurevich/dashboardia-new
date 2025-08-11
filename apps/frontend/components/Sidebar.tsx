import { FaStickyNote, FaBook, FaCalendarAlt, FaUser, FaCog, FaTachometerAlt } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

const menu = [
  { label: "Dashboard", icon: <FaTachometerAlt />, href: "/dashboard", type: "route" },
  { label: "Notas", icon: <FaStickyNote />, href: "/notas", type: "route" },
  { label: "Recursos", icon: <FaBook />, href: "/recursos", type: "route" },
  { label: "Eventos", icon: <FaCalendarAlt />, href: "/eventos", type: "route" },
  { label: "Usuarios", icon: <FaUser />, href: "/usuarios", type: "route" },
  { label: "Configuración", icon: <FaCog />, href: "/config", type: "route" },
];

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-20 bg-white dark:bg-gray-950 shadow-lg flex flex-col py-6 px-1 z-40 border-r border-gray-200 dark:border-gray-800">
      {/* Logo D más pequeño */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-xl font-extrabold shadow" style={{ fontFamily: 'Inter, sans-serif' }}>
          D
        </div>
      </div>
      <nav className="flex flex-col gap-6">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-center px-0 py-1 rounded-lg hover:bg-primary/10 dark:hover:bg-accent/10 text-gray-700 dark:text-gray-200 font-medium transition-colors relative"
            title={item.label}
          >
            <span className="text-lg">{item.icon}</span>
            {/* Tooltip visible solo en hover */}
            <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
