import { NextResponse } from "next/server";

export async function GET() {
  const key =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY ||
    "";
  return NextResponse.json({ key });
}


