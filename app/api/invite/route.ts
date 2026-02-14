import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { locales, defaultLocale } from '@/i18n/request';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    let t: ((key: string, values?: Record<string, any>) => string) | null = null;
    try {
        const { email, workspaceName, inviterName, link, locale } = await request.json();
        const resolvedLocale = locales.includes(locale) ? locale : defaultLocale;
        t = await getTranslations({ locale: resolvedLocale, namespace: 'invite_email' });

        const { data, error } = await resend.emails.send({
            from: 'Z App <onboarding@resend.dev>',
            to: email,
            subject: t('subject', { inviterName }),
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">${t('heading', { workspaceName })}</h1>
            <p style="font-size: 16px; color: #555;">
                ${t('intro', { inviterName, appName: 'Z' })}
            </p>
            <div style="margin: 24px 0;">
                <a href="${link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    ${t('cta')}
                </a>
            </div>
            <p style="font-size: 14px; color: #888;">
                ${t('or_copy')} <br>
                <a href="${link}" style="color: #666;">${link}</a>
            </p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Invite error:', error);
        if (!t) {
            t = await getTranslations({ locale: defaultLocale, namespace: 'invite_email' });
        }
        return NextResponse.json({ error: t('internal_error') }, { status: 500 });
    }
}
