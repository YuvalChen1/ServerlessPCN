// app/api/upload/route.ts (Vercel-compatible)
import { parsePcnFile, parseHeader } from '@/lib/pcnParser'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    try {
        const text = await file.text()
        const result = parsePcnFile(text)
        const headerData = parseHeader(result.header)

        return NextResponse.json({
            header: headerData,
            transactions: result.transactions,
            footer: result.footer,
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 })
    }
}
