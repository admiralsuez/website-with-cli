'use server';

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define the path to the JSON file
const dataFilePath = path.join(process.cwd(), 'public/data/projects.json');

// Helper function to read data from the JSON file
async function getProjectsData() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (isNodeError(error) && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

// GET handler to retrieve all projects or a single project by ID
export async function GET(req: NextRequest) {
  try {
    const projects = await getProjectsData();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const project = projects.find((p: { id: string }) => p.id === id);
      if (project) {
        return NextResponse.json(project);
      } else {
        return NextResponse.json({ message: 'Project not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json(projects);
    }
  } catch (error) {
    console.error('Failed to read projects data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler to update the projects data
export async function POST(req: NextRequest) {
  try {
    const updatedProjects = await req.json();
    await fs.writeFile(dataFilePath, JSON.stringify(updatedProjects, null, 2));
    return NextResponse.json({ message: 'Projects updated successfully' });
  } catch (error) {
    console.error('Failed to write projects data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
