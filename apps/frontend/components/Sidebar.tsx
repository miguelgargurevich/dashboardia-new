import { FaStickyNote, FaBook, FaCalendarAlt, FaUser, FaCog, FaTachometerAlt } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const menu = [
  { label: "Dashboard", icon: <FaTachometerAlt />, href: "/dashboard", type: "route" },
  { label: "Notas", icon: <FaStickyNote />, href: "/notas", type: "route" },
  { label: "Recursos", icon: <FaBook />, href: "/recursos", type: "route" },
  { label: "Eventos", icon: <FaCalendarAlt />, href: "/eventos", type: "route" },
  { label: "Usuarios", icon: <FaUser />, href: "/usuarios", type: "route" },
  { label: "Configuración", icon: <FaCog />, href: "/config", type: "route" },
];

export default function Sidebar() {
  const handleLogout = async () => {
    const { supabase } = await import("../lib/supabaseClient");
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
  return (
    <aside className="fixed top-0 left-0 h-screen w-20 bg-white dark:bg-gray-950 shadow-lg flex flex-col py-6 px-1 z-40 border-r border-gray-200 dark:border-gray-800">
      {/* Logo D más pequeño, ahora clickeable para ir al home */}
      <div className="flex items-center justify-center mb-10">
        <button
          onClick={() => window.location.href = "/"}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-xl font-extrabold shadow focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ fontFamily: 'Inter, sans-serif' }}
          title="Ir al inicio"
        >
          D
        </button>
      </div>
      <nav className="flex flex-col gap-6 flex-1">
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
      {/* Botón cerrar sesión */}
      <div className="mt-auto flex items-center justify-center pb-4">
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
          title="Cerrar sesión"
        >
          <span className="text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m0 0l3-3m-3 3l3 3" />
            </svg>
          </span>
        </button>
      </div>
    </aside>
  );
}
