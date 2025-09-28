# CLI Portfolio

This is a Next.js-based portfolio designed to look and feel like a command-line interface.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Managing Content

This portfolio uses a code-driven approach for content management, making it fast and easy to update your projects and theme directly in the source code.

### Editing the Theme

To change the site's colors, fonts, or welcome messages, edit the file at `src/lib/theme.ts`. All user-configurable values are in this file with comments explaining what they do.

### Editing Projects

To change the content of an existing project, navigate to `src/lib/projects/` and open the file corresponding to the project you want to edit (e.g., `project-1.ts`). You can modify the `name`, `description`, `techStack`, and other properties directly in this file.

### Adding a Project Image/Video

1.  **Place your media file** (image or video) into the `public/projects/` directory.
2.  **Update the `mediaPath`** in the corresponding project file (e.g., `project-1.ts`) to point to your new file. The path must start with `/projects/`. For example: `mediaPath: '/projects/my-cool-project.jpg'`.

### Adding a New Project

1.  **Create a New Project File:** In the `src/lib/projects/` directory, create a new file for your project (e.g., `project-4.ts`). It's best to follow the existing naming convention.

2.  **Add Project Data:** Copy the structure from an existing project file into your new file. Be sure to provide a **unique `id`** for the new project.

    ```typescript
    // In src/lib/projects/project-4.ts
    import type { Project } from '@/lib/types';

    export const project4: Project = {
      id: '4', // Must be unique!
      name: 'My New Awesome Project',
      description: 'A brief description of this amazing new project.',
      techStack: 'Next.js, Tailwind CSS',
      mediaPath: '/projects/new-project.jpg', // Place your image/video in the `public/projects` folder
      mediaType: 'image',
      hidden: false,
    };
    ```

3.  **Register the New Project:** Open `src/lib/projects/index.ts`. This file acts as the central registry for all your projects.
    *   Import your new project object at the top of the file.
    *   Add the new project object to the `projects` array. The order of projects in this array determines the order they appear on your homepage.

    ```typescript
    // In src/lib/projects/index.ts
    import { project1 } from './project-1';
    import { project2 } from './project-2';
    import { project3 } from './project-3';
    import { project4 } from './project-4'; // 1. Import your new project

    // 2. Add it to the array
    export const projects = [project1, project2, project3, project4];
    ```

After saving your changes, the new project will automatically appear on your portfolio.

## Deployment

Please see the `DEPLOYMENT.md` file for detailed instructions on how to deploy this application to your own server.

**IMPORTANT NOTE ON DATA PERSISTENCE:** This application saves your project and theme data to JSON files in the `public/data` directory. This approach requires a hosting environment with a **persistent filesystem** (like a traditional VPS). It will **not** work correctly on hosting platforms with an ephemeral filesystem (like Vercel, Netlify, or Firebase App Hosting), as your data will be lost on server restarts.
