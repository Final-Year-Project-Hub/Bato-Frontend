"use client";

import { RoadmapCard } from './RoadmapCard';
import { Roadmap } from '@/lib/hooks/useRoadmaps';
import { 
  Code2, 
  Database, 
  Brain, 
  Smartphone, 
  Globe, 
  Cpu, 
  Cloud, 
  Lock,
  LineChart 
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Default icons based on common roadmap titles
const getIconForTitle = (title: string): LucideIcon => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('react')) return Code2;
  if (lowerTitle.includes('node') || lowerTitle.includes('backend')) return Database;
  if (lowerTitle.includes('python') || lowerTitle.includes('ai')) return Brain;
  if (lowerTitle.includes('mobile')) return Smartphone;
  if (lowerTitle.includes('full stack') || lowerTitle.includes('web')) return Globe;
  if (lowerTitle.includes('machine learning') || lowerTitle.includes('ml')) return Cpu;
  if (lowerTitle.includes('cloud')) return Cloud;
  if (lowerTitle.includes('security') || lowerTitle.includes('cyber')) return Lock;
  if (lowerTitle.includes('data')) return LineChart;
  
  return Code2; // Default
};

// Color gradients
const colorGradients = [
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'bg-gradient-to-br from-green-500 to-green-600',
  'bg-gradient-to-br from-purple-500 to-purple-600',
  'bg-gradient-to-br from-pink-500 to-pink-600',
  'bg-gradient-to-br from-orange-500 to-orange-600',
  'bg-gradient-to-br from-indigo-500 to-indigo-600',
  'bg-gradient-to-br from-cyan-500 to-cyan-600',
  'bg-gradient-to-br from-red-500 to-red-600',
  'bg-gradient-to-br from-teal-500 to-teal-600',
];

// ✅ UPDATED: Accept props instead of using useRoadmaps hook
interface RoadmapsGridProps {
  roadmaps: Roadmap[];
  loading: boolean;
  error: string | null;
}

export default function RoadmapsGrid({ roadmaps, loading, error }: RoadmapsGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/70 text-lg">Loading your roadmaps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-foreground mb-2">Failed to Load Roadmaps</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold text-foreground mb-2">No Roadmaps Yet</h3>
          <p className="text-foreground/60 mb-6">
            Start your learning journey by creating your first roadmap!
          </p>
          <button 
            onClick={() => window.location.href = '/chat'}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Create Your First Roadmap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {roadmaps.map((roadmap, index) => {
        const icon = getIconForTitle(roadmap.title);
        const color = colorGradients[index % colorGradients.length];
        
        // Estimate hours based on proficiency
        const estimatedHours = 
          roadmap.proficiency === 'beginner' ? 150 :
          roadmap.proficiency === 'intermediate' ? 100 :
          roadmap.proficiency === 'advanced' ? 80 : 120;
        
        return (
          <RoadmapCard
            key={roadmap.id}
            id={roadmap.id}
            title={roadmap.title}
            description={roadmap.goal}
            icon={icon}
            estimatedHours={estimatedHours}
            color={color}
            gradient={color}
            index={index}
          />
        );
      })}
    </div>
  );
}