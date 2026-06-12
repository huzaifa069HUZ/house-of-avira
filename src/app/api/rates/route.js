import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // We use a free, no-key exchange rate API for demonstration.
    // Base currency is INR.
    const res = await fetch('https://open.er-api.com/v6/latest/INR');
    
    if (!res.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await res.json();
    
    return NextResponse.json({
      base: data.base_code,
      rates: data.rates,
    });
  } catch (error) {
    console.error("Exchange rate fetch error:", error);
    // Fallback static rates if API fails
    return NextResponse.json({
      base: 'INR',
      rates: {
        INR: 1,
        USD: 0.012, // approx 1 INR = 0.012 USD
        GBP: 0.0094,
        PHP: 0.70,  // approx 1 INR = 0.70 PHP
      }
    });
  }
}
