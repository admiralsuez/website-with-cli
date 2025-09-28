'use server';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const POST = async (req: NextRequest) => {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use a timestamp to make the filename unique
  const filename = `${Date.now()}_${file.name.toLowerCase().replace(/[^a-z0-9.]/g, '_')}`;
  const path = join(process.cwd(), 'public/projects', filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);
    
    // Return the public path
    const publicPath = `/projects/${filename}`;
    return NextResponse.json({ success: true, path: publicPath });

  } catch(error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, message: 'Error saving file' }, { status: 500 });
  }
};
