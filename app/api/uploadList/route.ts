import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const uploads = await prisma.mediaUpload.findMany({
      include: {
        mediaDescriptions: true
      },orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(uploads);
  } catch (error) {
    console.error('Error fetching media uploads:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
