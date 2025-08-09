import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { resumeId, previewUrl, settings } = (await req.json()) as {
            resumeId: string;
            previewUrl: string;
            settings?: Record<string, unknown>;
        };
        const cookie = req.headers.get("cookie") ?? "";

        const res = await fetch(process.env.PRINT_SERVER_URL ?? "http://localhost:4001/print", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Forward only needed fields; ensure pageFormat matches server expectations
            body: JSON.stringify({ resumeId, previewUrl, settings: { pageFormat: (settings as any)?.pageFormat }, cookie }),
        });

        if (!res.ok) {
            const err = await res.text();
            return NextResponse.json({ success: false, error: err }, { status: 500 });
        }

        const arrayBuffer = await res.arrayBuffer();
        return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=resume-${resumeId}.pdf`,
            },
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e?.message ?? "Print failed" }, { status: 500 });
    }
}


