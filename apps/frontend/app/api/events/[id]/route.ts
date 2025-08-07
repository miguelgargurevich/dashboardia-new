import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND_URL}/api/events/${params.id}`);
  const event = await res.json();
  return NextResponse.json(event, { status: res.status });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/events/${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND_URL}/api/events/${params.id}`, { method: 'DELETE' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
