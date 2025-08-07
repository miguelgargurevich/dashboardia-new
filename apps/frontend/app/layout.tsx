

import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-darkBg">
        {/* Cabecera global */}
        <header className="fixed top-0 left-56 right-0 h-16 bg-white dark:bg-darkBg border-b border-gray-200 dark:border-gray-800 flex items-center px-8 z-40 shadow">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary dark:text-primary">Dashboard IA Soporte</span>
            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary ml-2">v1</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {/* Toggle de tema claro/oscuro */}
            <ThemeToggle />
          </div>
        </header>
        <Sidebar />
        <main className="flex-1 ml-56 pt-20">{children}</main>
      </body>
    </html>
  );
}
