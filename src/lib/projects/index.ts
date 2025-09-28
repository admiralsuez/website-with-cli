import { project1 } from './project-1';
import { project2 } from './project-2';
import { project3 } from './project-3';

/**
 * This file is the single source of truth for all project data.
 * It imports each project from its own file and exports them as a single array.
 * To add, remove, or reorder projects, modify this array.
 */
export const projects = [project1, project2, project3];
