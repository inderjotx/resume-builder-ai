/**
 * Print server using Puppeteer (TypeScript).
 * Scripts:
 *  - pnpm --filter resume-print-server dev
 *  - pnpm --filter resume-print-server build && pnpm --filter resume-print-server start
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import puppeteer, { type PDFOptions, type Browser } from 'puppeteer';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

app.post('/print', (req: Request, res: Response) => {
    void (async () => {
        const { previewUrl, settings } = (req.body ?? {}) as {
            previewUrl?: string;
            settings?: { pageFormat?: string };
        };
        if (!previewUrl) {
            res.status(400).send('previewUrl required');
            return;
        }

        let browser: Browser | undefined;
        try {
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: true,
            });
            const page = await browser.newPage();
            await page.goto(previewUrl, { waitUntil: 'networkidle0' });

            const pageFormat: PDFOptions['format'] =
                settings?.pageFormat?.toLowerCase() === 'letter' ? 'letter' : 'a4';

            const pdfBuffer = await page.pdf({
                format: pageFormat,
                printBackground: true,
                margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
                preferCSSPageSize: false,
            });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Cache-Control', 'no-store');
            res.send(Buffer.from(pdfBuffer));
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to render PDF';
            console.error(e);
            res.status(500).send(message);
        } finally {
            if (browser) await browser.close();
        }
    })();
});

const port = Number(process.env.PORT ?? 4001);
app.listen(port, () => console.log(`Print server listening on :${port}`));


