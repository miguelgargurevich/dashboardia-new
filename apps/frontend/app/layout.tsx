
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Dashboard IA Soporte",
  description: "Gestión de soporte técnico y productividad con IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex">
        <Sidebar />
        <main className="flex-1 ml-56">{children}</main>
      </body>
    </html>
  );
}
