"use client";

import { RoadmapCard } from './RoadmapCard';
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

const roadmapsData = [
  {
    id: '1',
    title: 'React Development',
    description: 'Master React.js from basics to advanced concepts including hooks, context, and state management',
    icon: Code2,
    estimatedHours: 120,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    id: '2',
    title: 'Node.js Backend',
    description: 'Build scalable backend applications with Node.js, Express, and database integration',
    icon: Database,
    estimatedHours: 150,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    gradient: 'bg-gradient-to-br from-green-500 to-green-600'
  },
  {
    id: '3',
    title: 'Python for AI',
    description: 'Learn Python programming for AI and machine learning applications',
    icon: Brain,
    estimatedHours: 180,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
  },
  {
    id: '4',
    title: 'Mobile Development',
    description: 'Create native mobile apps using React Native for iOS and Android platforms',
    icon: Smartphone,
    estimatedHours: 140,
    color: 'bg-gradient-to-br from-pink-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-pink-500 to-pink-600'
  },
  {
    id: '5',
    title: 'Full Stack Web',
    description: 'Complete web development from frontend to backend with modern frameworks',
    icon: Globe,
    estimatedHours: 200,
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
  },
  {
    id: '6',
    title: 'Machine Learning',
    description: 'Deep dive into ML algorithms, neural networks, and practical AI applications',
    icon: Cpu,
    estimatedHours: 220,
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
  },
  {
    id: '7',
    title: 'Cloud Computing',
    description: 'Master AWS, Azure, and cloud architecture for scalable applications',
    icon: Cloud,
    estimatedHours: 160,
    color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600'
  },
  {
    id: '8',
    title: 'Cybersecurity',
    description: 'Learn security fundamentals, ethical hacking, and protection strategies',
    icon: Lock,
    estimatedHours: 170,
    color: 'bg-gradient-to-br from-red-500 to-red-600',
    gradient: 'bg-gradient-to-br from-red-500 to-red-600'
  },
  {
    id: '9',
    title: 'Data Science',
    description: 'Analyze and visualize data using Python, R, and modern data tools',
    icon: LineChart,
    estimatedHours: 190,
    color: 'bg-gradient-to-br from-teal-500 to-teal-600',
    gradient: 'bg-gradient-to-br from-teal-500 to-teal-600'
  }
];

export const RoadmapsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {roadmapsData.map((roadmap, index) => (
        <RoadmapCard
          key={roadmap.id}
          {...roadmap}
          index={index}
        />
      ))}
    </div>
  );
};