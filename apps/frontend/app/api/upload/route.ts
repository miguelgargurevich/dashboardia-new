import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const res = await fetch(`${BACKEND_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
