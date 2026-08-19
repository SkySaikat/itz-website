import { NextResponse } from 'next/server';

/*
 * Contact endpoint.
 *
 * This validates and logs the submission but does not yet deliver it — wire up
 * whichever transport the business already uses (Resend, SendGrid, HubSpot,
 * the existing Contact Form 7 inbox) at the marked TODO before launch.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Return 200 so the bot does
  // not learn it was rejected.
  if (typeof body.companyWebsite === 'string' && body.companyWebsite.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = str(body.name);
  const business = str(body.business);
  const email = str(body.email);

  const missing = Object.entries({ name, business, email })
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required field(s): ${missing.join(', ')}.` },
      { status: 422 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 422 });
  }

  const submission = {
    name,
    business,
    email,
    phone: str(body.phone),
    industry: str(body.industry),
    service: str(body.service),
    message: str(body.message),
    receivedAt: new Date().toISOString(),
  };

  // TODO(launch): deliver `submission` to the CRM / transactional email
  // provider. Until then it is logged so nothing is silently dropped in
  // staging.
  console.info('[contact] submission received', submission);

  return NextResponse.json({ ok: true });
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
