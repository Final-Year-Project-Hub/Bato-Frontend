import Subheading from "@/components/ui/Subheading";
import { Rocket, Target, WandSparkles } from "lucide-react";

type WorksType = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

const WorksData: WorksType[] = [
  {
    id: "goals",
    title: "Set Your Goals",
    description:
      "Tell us what you want to learn, project you want to build, technologies you want to learn",
    icon: Target,
  },
  {
    id: "path",
    title: "AI Generates Path",
    description:
      "Our AI analyzes your input and creates a personalized roadmap with milestones and resources",
    icon: WandSparkles,
  },
  {
    id: "learning",
    title: "Start Learning",
    description:
      "Follow your roadmap, track progress, get help from our AI chatbot whenever you need it",
    icon: Rocket,
  },
];

function WorksBox({ data }: { data: WorksType[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((feature) => {
        const Icon = feature.icon;
        return (
          <div key={feature.id} className="bg-grey rounded-lg p-6 py-15 space-y-4 flex flex-col justify-center items-center">
            <div className="bg-background rounded-lg p-4 w-fit h-fit flex items-center ">
              <Icon className=" h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-center opacity-80">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="bg-background">
      <div className="my-container py-20">
        <div className="flex flex-col items-center mb-10">
          <Subheading content="Process"/>
          <h1 className="heading mb-2">
            How <span className="text-primary">Bato.ai</span>
            Works
          </h1>
          <p>Start your coding journey in three simple steps</p>
        </div>
        <WorksBox data={WorksData} />
      </div>
    </section>
  );
}
