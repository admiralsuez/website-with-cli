import type { Project } from '@/lib/types';

/**
 * project-1.ts
 *
 * This file contains the data for a single project.
 * To edit the content of this project, modify the object below.
 *
 * To add a new project, create a new file in this directory and
 * import it in `src/lib/projects/index.ts`.
 */
export const project1: Project = {
  id: '1',
  name: 'Shakshuka',
  description:
    'A fully-featured e-commerce platform with a modern, clean interface. Built with Next.js for the frontend and a Node.js/Express backend. Includes features like product search, user authentication, shopping cart, and a Stripe integration for payments.',
  techStack: 'Next.js, TypeScript, Node.js, Stripe',
  liveUrl: 'https://example.com',
  repoUrl: 'https://github.com/example/repo',
  mediaPath: '/projects/placeholder-1.jpg',
  mediaType: 'image',
  hidden: false,
};
