import type { Theme } from './types';

/**
 * Edit this file to change the theme of your portfolio.
 * This includes colors, fonts, and the text that appears in the terminal.
 */
export const theme: Theme = {
  // --- Color Scheme ---
  primaryColor: '#2F4F4F', // Used for borders, highlights, and the cursor
  backgroundColor: '#1A1A1A', // The main background of the terminal
  accentColor: '#32CD32', // The primary text color

  // --- Typography ---
  font: 'Space Grotesk', // The font for the entire site

  // --- Terminal Text ---
  welcomeMessage: 'Making free software', // The message that appears on page load
  prompt: 'vibin@cportfolio', // The command line prompt (e.g., user@host)
  loadingCommand: 'ls projects', // The command that appears to "run" to show projects
};
