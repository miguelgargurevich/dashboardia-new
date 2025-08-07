"use client";

import NoteCard from "../../components/NoteCard";
import ResourceCard from "../../components/ResourceCard";
import EventCard from "../../components/EventCard";
import Calendar from "../../components/Calendar";
import UpcomingEventsPanel from "../../components/UpcomingEventsPanel";
import { useEffect, useState } from "react";
import { getTiposEventos } from "../../config/tipos";

export default function DashboardPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [tiposEventos, setTiposEventos] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorNotes, setErrorNotes] = useState<string | null>(null);
  const [errorResources, setErrorResources] = useState<string | null>(null);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

    fetch(`${backendUrl}/api/notes`)
      .then(res => res.json())
      .then(data => {
        setNotes(Array.isArray(data) ? data : data ? [data] : []);
        setLoadingNotes(false);
      })
      .catch(() => {
        setErrorNotes("Error al cargar notas");
        setLoadingNotes(false);
      });

    fetch(`${backendUrl}/api/resources`)
      .then(res => res.json())
      .then(data => {
        setResources(Array.isArray(data) ? data : data ? [data] : []);
        setLoadingResources(false);
      })
      .catch(() => {
        setErrorResources("Error al cargar recursos");
        setLoadingResources(false);
      });

    fetch(`${backendUrl}/api/events`)
      .then(res => res.json())
      .then(data => {
        setEvents(Array.isArray(data) ? data : data ? [data] : []);
        setLoadingEvents(false);
      })
      .catch(() => {
        setErrorEvents("Error al cargar eventos");
        setLoadingEvents(false);
      });

    getTiposEventos().then(setTiposEventos);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-darkBg p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary dark:text-accent">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Calendar events={events} tiposEventos={tiposEventos} />
        </div>
        <div>
          <UpcomingEventsPanel events={events} tiposEventos={tiposEventos} />
        </div>
      </div>
    </main>
  );
}
