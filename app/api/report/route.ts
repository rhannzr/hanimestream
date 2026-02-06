// app/api/report/route.ts
import { NextRequest, NextResponse } from "next/server";

interface ReportBody {
    animeTitle: string;
    episode: string;
    serverName: string;
    originalUrl: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ReportBody = await request.json();
        const { animeTitle, episode, serverName, originalUrl } = body;

        console.log("📝 Incoming Report:", { animeTitle, episode, serverName });

        // Validate required fields
        if (!animeTitle || !episode || !serverName) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error("Telegram credentials not configured");
            return NextResponse.json(
                { success: false, error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Format message with HTML
        const message =
            `<b>🚨 LAPORAN LINK MATI 🚨</b>\n\n` +
            `<b>Judul:</b> ${animeTitle}\n` +
            `<b>Eps:</b> ${episode}\n` +
            `<b>Server:</b> ${serverName}\n` +
            `<b>Link:</b> ${originalUrl || "N/A"}\n\n` +
            `<i>Segera diperbaiki ya, goy!</i>`;

        // Send to Telegram
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: "HTML",
                }),
            }
        );

        const telegramResult = await telegramResponse.json();

        if (!telegramResult.ok) {
            console.error("Telegram API error:", telegramResult);
            return NextResponse.json(
                { success: false, error: "Failed to send report" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Report API error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
