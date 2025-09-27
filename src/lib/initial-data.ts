import type { Project, Theme } from './types';

export const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Project Alpha',
    description: 'A revolutionary app that changes the way we see the world, built with cutting-edge technology for maximum performance.',
    techStack: 'Next.js, Tailwind CSS, TypeScript, Firebase',
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    id: '2',
    name: 'Project Beta',
    description: 'An e-commerce platform designed for scalability and a seamless user experience, featuring a modern design system.',
    techStack: 'React, Node.js, Express, MongoDB',
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    id: '3',
    name: 'Project Gamma',
    description: 'A data visualization tool that turns complex datasets into beautiful, interactive charts and graphs.',
    techStack: 'D3.js, Svelte, Python, Flask',
    repoUrl: '#',
  },
  {
    id: '4',
    name: 'Project Delta',
    description: 'A mobile-first social networking application focused on connecting people with shared interests and hobbies.',
    techStack: 'Flutter, Dart, Google Cloud',
    liveUrl: '#',
  },
];

export const initialTheme: Theme = {
  primaryColor: '#2F4F4F',
  backgroundColor: '#1A1A1A',
  accentColor: '#32CD32',
  font: 'Space Grotesk',
};
