'use server';

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define the path to the JSON file
const dataFilePath = path.join(process.cwd(), 'public/data/theme.json');

// Helper function to read data from the JSON file
async function getThemeData() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      // Return a default theme if the file doesn't exist
      return {
        primaryColor: '#2F4F4F',
        backgroundColor: '#1A1A1A',
        accentColor: '#32CD32',
        font: 'Space Grotesk',
        welcomeMessage: ' welcome-to-my-portfolio',
        prompt: 'user@cli-portfolio',
        loadingCommand: 'ls projects',
      };
    }
    throw error;
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

// GET handler to retrieve the theme
export async function GET() {
  try {
    const theme = await getThemeData();
    return NextResponse.json(theme);
  } catch (error) {
    console.error('Failed to read theme data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler to update the theme data
export async function POST(req: NextRequest) {
  try {
    const updatedTheme = await req.json();
    await fs.writeFile(dataFilePath, JSON.stringify(updatedTheme, null, 2));
    return NextResponse.json({ message: 'Theme updated successfully' });
  } catch (error) {
    console.error('Failed to write theme data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
