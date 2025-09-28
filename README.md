# CLI Portfolio

This is a Next.js-based portfolio designed to look and feel like a command-line interface. It includes an admin panel for managing projects and customizing the theme.

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

## Admin Panel

You can access the admin panel by opening the interactive terminal (click on the command prompt at the bottom) and typing `admin`.

The default password is set as an environment variable. For local development, create a `.env.local` file in the root of the project and add:

```
ADMIN_PASSWORD=password
```

## Deployment

Please see the `DEPLOYMENT.md` file for detailed instructions on how to deploy this application to your own server.

**IMPORTANT NOTE ON DATA PERSISTENCE:** This application saves your project and theme data to JSON files in the `public/data` directory. This approach requires a hosting environment with a **persistent filesystem** (like a traditional VPS). It will **not** work correctly on hosting platforms with an ephemeral filesystem (like Vercel, Netlify, or Firebase App Hosting), as your data will be lost on server restarts.
