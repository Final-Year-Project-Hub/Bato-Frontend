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

export interface RoadmapTopic {
  id: string;
  title: string;
  doc_link: string;
  description: string;
  estimated_hours: number;
}

export interface RoadmapPhase {
  id: string;
  phase_number: number;
  title: string;
  description: string;
  estimated_hours: number;
  topics: RoadmapTopic[];
}


export interface RoadmapResponse {
  goal: string;
  intent: string;
  key_technologies: string[];
  next_steps: string[];
  prerequisites: string[];
  proficiency: "beginner" | "intermediate" | "advanced";
  total_estimated_hours: number;
  phases: RoadmapPhase[];
}
