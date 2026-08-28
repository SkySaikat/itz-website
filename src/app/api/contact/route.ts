import { NextResponse } from 'next/server';

import { emailConfig, sendEmail } from '@/lib/email';
import { confirmationEmail, notificationEmail, type ContactSubmission } from '@/lib/email-templates';

/*
 * Contact endpoint.
 *
 * Validates the submission, then sends two emails via Resend (see src/lib/email.ts):
 *   1. an internal notification to CONTACT_NOTIFY_TO (production@itzontarget.com)
 *      with every field, reply-to set to the enquirer so a reply goes straight
 *      back to them;
 *   2. a branded "thanks, we've got it" confirmation to the enquirer.
 *
 * Email delivery never blocks the response: if the provider is misconfigured or
 * down, the failure is logged and the submission still returns { ok: true } so
 * the lead is not lost and the visitor is not shown an error for something that
 * did, in fact, arrive.
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

  const submission: ContactSubmission = {
    name,
    business,
    email,
    phone: str(body.phone),
    industry: str(body.industry),
    service: str(body.service),
    message: str(body.message),
    pagePath: str(body.pagePath) || pathFromReferer(request.headers.get('referer')),
    receivedAt: new Date().toISOString(),
  };

  console.info('[contact] submission received', { ...submission, message: submission.message.slice(0, 120) });

  const notify = notificationEmail(submission);
  const confirm = confirmationEmail(submission);

  const [notifyResult, confirmResult] = await Promise.allSettled([
    sendEmail({
      to: emailConfig.notifyTo,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
      replyTo: submission.email,
    }),
    sendEmail({
      to: submission.email,
      subject: confirm.subject,
      html: confirm.html,
      text: confirm.text,
    }),
  ]);

  logDelivery('notification', notifyResult);
  logDelivery('confirmation', confirmResult);

  return NextResponse.json({ ok: true });
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

function pathFromReferer(referer: string | null): string {
  if (!referer) return '/contact';
  try {
    return new URL(referer).pathname || '/contact';
  } catch {
    return '/contact';
  }
}

function logDelivery(kind: string, result: PromiseSettledResult<Awaited<ReturnType<typeof sendEmail>>>) {
  if (result.status === 'rejected') {
    console.error(`[contact] ${kind} email rejected:`, result.reason);
    return;
  }
  const r = result.value;
  if (r.ok) {
    console.info(`[contact] ${kind} email sent (${r.id})`);
  } else if ('skipped' in r && r.skipped) {
    console.warn(`[contact] ${kind} email skipped — RESEND_API_KEY not configured`);
  } else {
    console.error(`[contact] ${kind} email failed:`, 'error' in r ? r.error : 'unknown');
  }
}
