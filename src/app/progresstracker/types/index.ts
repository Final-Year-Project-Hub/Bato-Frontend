export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  duration?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: boolean;
  description?: string;
}

export interface RoadmapProgress {
  id: string;
  title: string;
  totalModules: number;
  totalLessons: number;
  completedModules: number;
  completedLessons: number;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}