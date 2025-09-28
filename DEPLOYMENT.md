# Deploying Your Next.js Application

This guide provides step-by-step instructions for deploying your CLI Portfolio application to your own server.

**IMPORTANT NOTE ON DATA PERSISTENCE:** This application saves your project and theme data to JSON files in the `public/data` directory. This approach requires a hosting environment with a **persistent filesystem**, such as a traditional Virtual Private Server (VPS) or a dedicated server.

Many modern hosting platforms (like Vercel, Netlify, and Firebase App Hosting) use an **ephemeral filesystem**. This means that any changes made to the files on the server after deployment will be lost when the server restarts or goes to sleep. If you use one of these platforms, **your content will disappear** after you add it through the Admin Panel.

For production use on these platforms, you would need to modify the application to use a database (e.g., Firebase Firestore, Supabase, etc.) for data storage. The current file-based system is designed for simplicity on servers where you have direct control over the filesystem.

## Prerequisites

Before you begin, ensure your server has the following installed:

- **Node.js** (version 18.x or later is recommended)
- **npm** (which comes with Node.js)

You can check your Node.js version by running `node -v` on your server.

## Deployment Steps

Follow these steps to get your application running in a production environment.

### 1. Build the Application

First, you need to create a production-ready build of your application. On your local machine (or on the server if you're pulling the code directly), run the following command:

```bash
npm run build
```

This command compiles your application and creates an optimized build in the `.next` directory.

### 2. Transfer Files to Your Server

Next, you need to copy the necessary files to your server. You can use tools like `scp`, `rsync`, or a Git-based workflow. The essential files and directories you need to transfer are:

- `.next/` (the production build)
- `public/` (contains your uploaded media and data files)
- `node_modules/`
- `package.json`
- `next.config.ts`

A common practice is to copy the entire project directory to the server.

### 3. Install Production Dependencies

Once the files are on your server, navigate to the project directory and install only the dependencies required for production. This is more efficient than installing all the development dependencies.

```bash
npm install --production
```

### 4. Set Environment Variables

Your application uses an environment variable for the admin password. You need to set this on your server.

Create a file named `.env.local` in the root of your project directory and add the following line, replacing `your_secure_password` with a password of your choice:

```
ADMIN_PASSWORD=your_secure_password
```

**Note:** For security reasons, do not commit the `.env.local` file to your version control system (e.g., Git).

### 5. Start the Application

Now you can start the Next.js production server. Run the following command:

```bash
npm run start
```

By default, the application will start on port 3000. You can specify a different port if needed:

```bash
npm run start -- -p 8080
```

### 6. (Recommended) Use a Process Manager

For a real production environment, running `npm run start` directly is not ideal because the process will stop if you close your terminal or if it crashes.

It's highly recommended to use a process manager like **`pm2`** to keep your application running continuously.

**Installing pm2:**

```bash
npm install pm2 -g
```

**Starting your app with pm2:**

```bash
pm2 start npm --name "cli-portfolio" -- run start
```

This command will:
- Start your application in the background.
- Automatically restart it if it crashes.
- Allow you to manage logs and monitor the process.

You can manage your app with commands like `pm2 list`, `pm2 logs`, and `pm2 stop cli-portfolio`.
