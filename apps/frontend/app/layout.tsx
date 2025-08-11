"use client";


import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import FloatingAssistant from "../components/FloatingAssistant";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Si no está logueado y no está en /login, redirige al login
    if (!session && pathname !== "/login") {
      router.push("/login");
    }
    // Si está logueado y está en /login, redirige al dashboard
    if (session && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [session, pathname, router]);

  // Si está en /login, no renderizar sidebar ni header
  const isLoginPage = pathname === "/login";

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-bg dark:bg-bg-dark">
        {!isLoginPage && (
          <>
            <header className="fixed top-0 left-20 right-0 h-16 bg-bg dark:bg-bg-dark border-b border-border dark:border-border-dark flex items-center px-8 z-40 shadow">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-primary dark:text-primary">Dashborad IA</span>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <ThemeToggle />
              </div>
            </header>
            <Sidebar />
            <main className="flex-1 ml-20 pt-16">{children}</main>
            <FloatingAssistant />
          </>
        )}
        {isLoginPage && (
          <main className="min-h-screen">{children}</main>
        )}
      </body>
    </html>
  );
}
