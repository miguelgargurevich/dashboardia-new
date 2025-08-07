

import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-bg dark:bg-bg-dark">
        {/* Cabecera global */}
        <header className="fixed top-0 left-56 right-0 h-16 bg-bg dark:bg-bg-dark border-b border-border dark:border-border-dark flex items-center px-8 z-40 shadow">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary dark:text-primary"></span>
            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary ml-2"></span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {/* Toggle de tema claro/oscuro */}
            <ThemeToggle />
          </div>
        </header>
        <Sidebar />
        <main className="flex-1 ml-56 pt-16">{children}</main>
      </body>
    </html>
  );
}
