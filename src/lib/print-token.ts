import crypto from 'node:crypto';

const getSecret = (): string => {
    const secret = process.env.PRINT_PREVIEW_SECRET;
    if (!secret) throw new Error('PRINT_PREVIEW_SECRET is not set');
    return secret;
};

export function createPrintToken(resumeId: string, ttlMs = 60_000): string {
    const exp = Date.now() + ttlMs;
    const payload = `${resumeId}.${exp}`;
    const h = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
    return `${payload}.${h}`;
}

export function verifyPrintToken(token: string, resumeId: string): boolean {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [id, expStr, sig] = parts;
    if (id !== resumeId) return false;
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() > exp) return false;
    const payload = `${id}.${exp}`;
    const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}


