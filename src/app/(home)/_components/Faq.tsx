import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Subheading from "@/components/ui/Subheading";
import { Minus, Plus } from "lucide-react";
import Road from "@/../public/raw.png";
import Image from "next/image";

type FaqType = {
  id: number;
  question: string;
  answer: string;
};

const qaItems: FaqType[] = [
  {
    id: 1,
    question: "What is Bato.ai?",
    answer:
      "Bato.ai is an AI-powered learning platform that helps developers and students generate personalized learning roadmaps and get instant guidance while learning new technologies.",
  },
  {
    id: 2,
    question: "How does Bato.ai work?",
    answer:
      "Bato.ai analyzes your goals, current skill level, and learning preferences to generate a custom roadmap and provides an AI assistant to help you learn step by step.",
  },
  {
    id: 3,
    question: "Who is Bato.ai for?",
    answer:
      "Bato.ai is designed for students, self-learners, and developers who want a clear, structured path to learn programming and technical skills efficiently.",
  },
  {
    id: 4,
    question: "Is Bato.ai free to use?",
    answer:
      "Yes. You can explore roadmaps and core learning features for free. Advanced features may be added in the future.",
  },
//   {
//     id: 5,
//     question: "What makes Bato.ai different?",
//     answer:
//       "Unlike generic tutorials, Bato.ai provides personalized roadmaps, curated resources, progress tracking, and AI-powered help—all in one place.",
//   },
];


async function FaqContent() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4 mb-10">
      {qaItems.map((item) => (
        <AccordionItem
          value={item.question}
          key={item.id}
          className="bg-background border border-foreground/30 p-5 rounded-lg "
        >
          <AccordionTrigger
            className="
                  group flex items-center justify-between
                  hover:no-underline text-sans font-semibold 
                  text-lg sm:text-xl py-5 cursor-pointer 
                  [&>svg]:hidden
                  "
          >
            <div className="flex items-center">
              <span>{item.question}</span>
            </div>

            {/* Custom plus / minus */}
            <span className="">
              <span className="group-data-[state=open]:hidden ">
                <Plus />
              </span>
              <span className="hidden group-data-[state=open]:inline">
                <Minus />
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="text-foreground/80 text-base sm:text-lg">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
export default function FAQ() {
  return (
    <section className="pt-[70px] flex flex-col items-center bg-grey">
      {/* Titles */}
      <div className="max-w-2xl flex flex-col items-center mb-10">
        <Subheading content="FAQ" className="bg-background" />
        <h1 className="heading">
          Confusions <span className="text-primary">cleared</span>
        </h1>
        <p className="text-center mt-2">
          Everything you need to know about Hone, how it works, and how to find
          a center near you. If you don&apos;t see your question here, feel free
          to reach out.
        </p>
      </div>
      {/* QA */}
      <div className="my-container flex sm:gap-18">
        <Image src={Road} alt="" className="hidden sm:block object-contain" />
        <FaqContent />
      </div>
    </section>
  );
}
