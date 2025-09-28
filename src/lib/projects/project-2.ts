import type { Project } from '@/lib/types';

/**
 * project-2.ts
 *
 * This file contains the data for a single project.
 * To edit the content of this project, modify the object below.
 */
export const project2: Project = {
  id: '2',
  name: 'Task Management App',
  description:
    'A responsive task management application that helps users organize their daily tasks. Features include drag-and-drop reordering, due dates, priority levels, and project categorization. Real-time updates are handled with WebSockets.',
  techStack: 'React, Redux, Firebase, WebSockets',
  liveUrl: 'https://example.com',
  repoUrl: 'https://github.com/example/repo',
  mediaPath: '/projects/placeholder-2.jpg',
  mediaType: 'image',
  hidden: false,
};
