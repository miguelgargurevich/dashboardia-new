
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export async function getTiposNotas() {
  const res = await fetch(`${API_BASE}/tipo-nota`);
  return await res.json();
}

export async function getTiposRecursos() {
  const res = await fetch(`${API_BASE}/tipo-recurso`);
  return await res.json();
}

export async function getTiposEventos() {
  const res = await fetch(`${API_BASE}/tipo-evento`);
  return await res.json();
}
