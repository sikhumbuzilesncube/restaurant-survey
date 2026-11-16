import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// This is the real endpoint Meta will call
export async function GET(req: Request) {
  // Verification for Meta
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
  // This is where real WhatsApp replies will land
  const body = await req.json();
  
  // (In the future, we parse the real Meta payload here)
  console.log("Webhook received:", JSON.stringify(body));

  return NextResponse.json({ success: true });
}
