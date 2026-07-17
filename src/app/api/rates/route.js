import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    base: 'INR',
    rates: { INR: 1 },
  });
}
