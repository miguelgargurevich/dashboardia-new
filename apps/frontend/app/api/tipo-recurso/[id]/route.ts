import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const id = pathname.split('/').pop();
  const res = await fetch(`${BACKEND_URL}/api/tipo-recurso/${id}`);
  const tipo = await res.json();
  return NextResponse.json(tipo, { status: res.status });
}

export async function PUT(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const id = pathname.split('/').pop();
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/tipo-recurso/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const id = pathname.split('/').pop();
  const res = await fetch(`${BACKEND_URL}/api/tipo-recurso/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
