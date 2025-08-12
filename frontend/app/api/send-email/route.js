import { EmailTemplate } from '@/app/_componets/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            return Response.json({ error: 'Email service not configured' }, { status: 500 });
        }

        const { email, fullName, amount } = await request.json();
        console.log('Email route input:', { email, fullName, amount });
        if (!email) {
            return Response.json({ error: 'Recipient email is required' }, { status: 400 });
        }
        const { data, error } = await resend.emails.send({
            from: 'Shop <onboarding@resend.dev>',
            to: [email],
            subject: 'Order confirmation',
            react: EmailTemplate({ firstName: fullName ?? 'Customer', amount }),
        });

        if (error) {
            console.error('Resend error:', error);
            return Response.json({ error: error?.message || 'Failed to send email' }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        console.error('Email route error:', error);
        return Response.json({ error: error?.message ?? 'Unexpected error' }, { status: 500 });
    }
}