import Subheading from "@/components/ui/Subheading";
import { Route, MessageSquare, BarChart3, BookOpen } from "lucide-react";

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

const FeatureData: Feature[] = [
  {
    id: "custom-roadmaps",
    title: "Custom Roadmaps",
    description:
      "AI generates personalized learning paths based on your goals, experience level, and available time. Every roadmap is unique to you.",
    icon: Route,
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot",
    description:
      "Get instant answers to your coding questions. Our intelligent chatbot provides explanations, debugging help, and code examples 24/7.",
    icon: MessageSquare,
  },
  {
    id: "progress-tracking",
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed analytics. See your improvements, celebrate milestones, and stay motivated.",
    icon: BarChart3,
  },
  // TODO: chnage content
  {
    id: "curated-resources",
    title: "Curated Resources",
    description:
      "Access handpicked tutorials, courses, and documentation. Every resource is vetted and aligned with your learning path.",
    icon: BookOpen,
  },
];

function FeaturesBox({ data }: { data: Feature[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {data.map((feature) => {
        const Icon = feature.icon;
        return (
          <div key={feature.id} className="bg-background rounded-lg p-6 space-y-4">
            <div className="bg-secondary rounded-lg p-2 w-fit h-fit flex items-center">
              <Icon className=" h-6 w-6 text-background" />
            </div>
            <h3 className="text-primary text-2xl font-bold mb-2">{feature.title}</h3>
            <p className="text-sm opacity-80">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function Features() {
  return (
    <section className="bg-grey">
      <div className="my-container py-20">
        <div className="flex flex-col items-center">
          <Subheading content="Features" className="bg-background" />
          <h1 className="heading mb-2">
            Everything You Need to{" "}
            <span className="text-primary">Master Coding</span>
          </h1>
          <p>
            Powerful AI tools and personalized guidance to accelerate your
            learning journey
          </p>

          <div className="mt-10 w-full">
            <FeaturesBox data={FeatureData} />
          </div>
        </div>
      </div>
    </section>
  );
}
