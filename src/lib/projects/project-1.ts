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
    'A task management website which focuses on you rather than your team',
  techStack: 'Tailwind, React',
  liveUrl: 'https://shakshuka.birbot.tech',
  repoUrl: 'coming soon',
  mediaPath: '/projects/shak.jpg',
  mediaType: 'image',
  hidden: false,
};
