'use client';

import type { Project, Theme } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import ProjectForm from './project-form';
import ThemeForm from './theme-form';
import { useState } from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { ScrollArea } from './ui/scroll-area';

interface AdminPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function AdminPanel({
  isOpen,
  onOpenChange,
  projects,
  setProjects,
  currentTheme,
  onThemeChange,
}: AdminPanelProps) {
  const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddProject = () => {
    setEditingProject(null);
    setProjectDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectDialogOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  const handleProjectFormSubmit = (project: Project) => {
    if (editingProject) {
      setProjects(
        projects.map((p) => (p.id === project.id ? project : p))
      );
    } else {
      setProjects([...projects, { ...project, id: new Date().getTime().toString() }]);
    }
    setProjectDialogOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-2xl lg:max-w-4xl flex flex-col">
        <SheetHeader>
          <SheetTitle>Admin Panel</SheetTitle>
          <SheetDescription>
            Customize your portfolio content and appearance.
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="projects" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="flex-1 flex flex-col gap-4 pt-4 min-h-0">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-lg font-medium">Manage Projects</h3>
              <Button onClick={handleAddProject} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
            <p className="text-sm text-muted-foreground px-1">
              Changes made here will be reflected on the project's individual page.
            </p>
            <ScrollArea className="flex-1 -mx-6">
                <div className="px-6 space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 rounded-md bg-secondary"
                >
                  <span className="font-semibold text-sm">{project.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProject(project)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the project "{project.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="appearance" className="flex-1 overflow-y-auto -mx-6">
            <div className="px-6">
              <ThemeForm
                currentTheme={currentTheme}
                onThemeChange={onThemeChange}
              />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>

      <Dialog
        open={isProjectDialogOpen}
        onOpenChange={setProjectDialogOpen}
      >
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
             <DialogDescription>
              Provide the details for your project. Your media will be uploaded to the server.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto -mx-6">
            <div className="px-6">
              <ProjectForm
                project={editingProject}
                onSave={handleProjectFormSubmit}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
