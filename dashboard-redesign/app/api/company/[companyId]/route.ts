// app/api/company/[companyId]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const companyId = req.nextUrl.pathname.split('/').pop()

    try {
        const res = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=f004176c-b85f-4542-8901-7b3176f9a054&filters=${encodeURIComponent(JSON.stringify({ "מספר חברה": companyId }))}`)
        const data = await res.json()

        if (data.success) {
            return NextResponse.json(data.result)
        } else {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 })
        }
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'Failed to fetch company data' }, { status: 500 })
    }
}
