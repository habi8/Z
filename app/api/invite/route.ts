import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, workspaceName, inviterName, link } = await request.json();

        const { data, error } = await resend.emails.send({
            from: 'Z App <onboarding@resend.dev>',
            to: email,
            subject: `ZED workspace invitation from ${inviterName}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">You've been invited to join ${workspaceName}</h1>
            <p style="font-size: 16px; color: #555;">
                <strong>${inviterName}</strong> has invited you to collaborate on their workspace in Z.
            </p>
            <div style="margin: 24px 0;">
                <a href="${link}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    Join Workspace
                </a>
            </div>
            <p style="font-size: 14px; color: #888;">
                Or copy this link: <br>
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
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
