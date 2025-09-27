export type Project = {
  id: string;
  name?: string;
  description?: string;
  techStack?: string;
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  hidden?: boolean;
};

export type Theme = {
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  font: string;
  welcomeMessage?: string;
  prompt?: string;
  loadingCommand?: string;
};
