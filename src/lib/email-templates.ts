import 'server-only';

import { addressLine, site } from './site';

/**
 * HTML + plain-text builders for the contact-form emails.
 *
 * Table-based, all styles inline, 600px wide — the combination Gmail, Outlook
 * and Apple Mail all render the same way. The logo is a hosted PNG (email
 * clients don't render SVG) with a text `alt` fallback for when images are
 * blocked.
 */

export type ContactSubmission = {
  name: string;
  business: string;
  email: string;
  phone: string;
  industry: string;
  service: string;
  message: string;
  /** Page the form was submitted from, e.g. "/contact" or "/services/seo". */
  pagePath: string;
  receivedAt: string;
};

const C = {
  navy: '#00386C',
  navyDark: '#0B2D57',
  blue: '#0974E4',
  blueDark: '#075CBC',
  amber: '#FBBB5B',
  ink: '#0B1220',
  inkMuted: '#4C5A70',
  faint: '#8593A8',
  surface: '#F4F6FB',
  border: '#D7E5F5',
  white: '#FFFFFF',
};

/**
 * Absolute base for email images — recipients' mail clients fetch these, so it
 * must be a public URL. Defaults to the production site; set EMAIL_ASSET_BASE
 * on a staging deploy so its emails show the logo too.
 */
const ASSET_BASE = (process.env.EMAIL_ASSET_BASE || site.url).replace(/\/$/, '');
const LOGO = `${ASSET_BASE}/logo/itz-digital-email-white.png`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Wraps content in the shared branded shell. */
function layout(opts: { preheader: string; heading: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(opts.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.surface};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.surface};padding:28px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${C.white};border:1px solid ${C.border};border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr>
          <td style="background:${C.navy};background-image:linear-gradient(135deg,${C.navyDark},${C.navy} 60%,${C.blueDark});padding:30px 32px;">
            <img src="${LOGO}" width="176" alt="ITZ Digital" style="display:block;width:176px;height:auto;border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:34px 32px 8px;">
            <h1 style="margin:0;font-size:21px;line-height:1.3;color:${C.navy};font-weight:800;">${escapeHtml(opts.heading)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 34px;color:${C.inkMuted};font-size:15px;line-height:1.65;">
            ${opts.body}
          </td>
        </tr>
        <tr>
          <td style="background:${C.surface};border-top:1px solid ${C.border};padding:22px 32px;color:${C.faint};font-size:12px;line-height:1.6;">
            <strong style="color:${C.inkMuted};">${escapeHtml(site.legalName)}</strong><br>
            ${escapeHtml(addressLine)}<br>
            <a href="tel:${site.phoneHref.replace('tel:', '')}" style="color:${C.blue};text-decoration:none;">${escapeHtml(site.phone)}</a>
            &nbsp;&middot;&nbsp;
            <a href="mailto:${site.email}" style="color:${C.blue};text-decoration:none;">${escapeHtml(site.email)}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function row(labelText: string, valueHtml: string): string {
  return `<tr>
  <td style="padding:12px 0;border-bottom:1px solid ${C.border};width:150px;vertical-align:top;color:${C.faint};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(labelText)}</td>
  <td style="padding:12px 0;border-bottom:1px solid ${C.border};vertical-align:top;color:${C.ink};font-size:15px;">${valueHtml}</td>
</tr>`;
}

const dash = `<span style="color:${C.faint};">—</span>`;

// ── Internal notification ────────────────────────────────────────────────────

export function notificationEmail(s: ContactSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const tag = [s.industry, s.service].filter(Boolean).join(' · ');
  const subject = `New enquiry: ${s.name} — ${s.business}${tag ? ` (${tag})` : ''}`;

  const received = new Date(s.receivedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Denver',
  });

  const messageHtml = s.message
    ? escapeHtml(s.message).replace(/\n/g, '<br>')
    : dash;

  const body = `
    <p style="margin:0 0 20px;color:${C.inkMuted};font-size:15px;line-height:1.65;">
      A new enquiry just came in through the website contact form. Reply to this email to respond to
      <strong style="color:${C.ink};">${escapeHtml(s.name)}</strong> directly.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${row('Name', escapeHtml(s.name))}
      ${row('Business', escapeHtml(s.business))}
      ${row('Email', `<a href="mailto:${escapeHtml(s.email)}" style="color:${C.blue};text-decoration:none;">${escapeHtml(s.email)}</a>`)}
      ${row('Phone', s.phone ? `<a href="tel:${escapeHtml(s.phone)}" style="color:${C.blue};text-decoration:none;">${escapeHtml(s.phone)}</a>` : dash)}
      ${row('Industry', s.industry ? escapeHtml(s.industry) : dash)}
      ${row('Interested in', s.service ? escapeHtml(s.service) : dash)}
      ${row('Message', messageHtml)}
      ${row('Submitted from', `<span style="color:${C.inkMuted};">${escapeHtml(s.pagePath || '/contact')}</span>`)}
      ${row('Received', `<span style="color:${C.inkMuted};">${escapeHtml(received)} MT</span>`)}
    </table>
    <p style="margin:24px 0 0;">
      <a href="mailto:${escapeHtml(s.email)}?subject=${encodeURIComponent(`Re: your enquiry to ${site.name}`)}"
         style="display:inline-block;background:${C.blue};background-image:linear-gradient(135deg,${C.blue},${C.blueDark});color:${C.white};text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:22px;">
        Reply to ${escapeHtml(s.name.split(' ')[0] || s.name)}
      </a>
    </p>`;

  const text = [
    `New website enquiry`,
    ``,
    `Name:          ${s.name}`,
    `Business:      ${s.business}`,
    `Email:         ${s.email}`,
    `Phone:         ${s.phone || '—'}`,
    `Industry:      ${s.industry || '—'}`,
    `Interested in: ${s.service || '—'}`,
    `Message:       ${s.message || '—'}`,
    `Submitted from: ${s.pagePath || '/contact'}`,
    `Received:      ${received} MT`,
    ``,
    `Reply to this email to respond to ${s.name} directly.`,
  ].join('\n');

  return { subject, html: layout({ preheader: `${s.name} from ${s.business}`, heading: 'New website enquiry', body }), text };
}

// ── Submitter confirmation ──────────────────────────────────────────────────

export function confirmationEmail(s: ContactSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const firstName = s.name.split(' ')[0] || s.name;
  const subject = `Thanks for reaching out to ${site.name}`;

  const recapRows = [
    s.business && row('Business', escapeHtml(s.business)),
    s.industry && row('Industry', escapeHtml(s.industry)),
    s.service && row('Interested in', escapeHtml(s.service)),
    s.message && row('Your message', escapeHtml(s.message).replace(/\n/g, '<br>')),
  ]
    .filter(Boolean)
    .join('');

  const body = `
    <p style="margin:0 0 16px;color:${C.ink};font-size:16px;line-height:1.6;">
      Hi ${escapeHtml(firstName)},
    </p>
    <p style="margin:0 0 16px;color:${C.inkMuted};font-size:15px;line-height:1.65;">
      Thanks for getting in touch with ${escapeHtml(site.name)}. We&rsquo;ve received your enquiry and a
      member of our team will get back to you <strong style="color:${C.ink};">within one business day</strong>,
      usually sooner.
    </p>
    <p style="margin:0 0 24px;color:${C.inkMuted};font-size:15px;line-height:1.65;">
      If it&rsquo;s urgent, call us on
      <a href="${site.phoneHref}" style="color:${C.blue};text-decoration:none;font-weight:700;">${escapeHtml(site.phone)}</a>
      and you&rsquo;ll get a person, not a queue.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.surface};border:1px solid ${C.border};border-radius:12px;">
      <tr><td style="padding:8px 20px;">
        <p style="margin:12px 0 4px;color:${C.faint};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">What you sent us</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${recapRows || row('Name', escapeHtml(s.name))}
        </table>
      </td></tr>
    </table>

    <p style="margin:26px 0 0;">
      <a href="${site.url}/case-studies"
         style="display:inline-block;background:${C.blue};background-image:linear-gradient(135deg,${C.blue},${C.blueDark});color:${C.white};text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:22px;">
        See our results while you wait
      </a>
    </p>

    <p style="margin:24px 0 0;color:${C.faint};font-size:13px;line-height:1.6;">
      We use your details to respond to this enquiry only — no lists, no resale.
    </p>`;

  const text = [
    `Hi ${firstName},`,
    ``,
    `Thanks for getting in touch with ${site.name}. We've received your enquiry and will get back to you within one business day, usually sooner.`,
    ``,
    `If it's urgent, call us on ${site.phone}.`,
    ``,
    s.business ? `Business: ${s.business}` : null,
    s.industry ? `Industry: ${s.industry}` : null,
    s.service ? `Interested in: ${s.service}` : null,
    s.message ? `Your message: ${s.message}` : null,
    ``,
    `We use your details to respond to this enquiry only — no lists, no resale.`,
    ``,
    `${site.legalName} · ${addressLine} · ${site.phone}`,
  ]
    .filter((l) => l !== null)
    .join('\n');

  return {
    subject,
    html: layout({
      preheader: `We've got your enquiry — we'll reply within one business day.`,
      heading: `Thanks, we've got it`,
      body,
    }),
    text,
  };
}
