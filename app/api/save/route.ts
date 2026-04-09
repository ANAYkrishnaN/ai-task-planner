import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { filename, data } = await request.json();

    const filePath = path.join(process.cwd(), 'data', filename + '.json');

    let existing = [];
    try {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {}

    existing.push(data);

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
