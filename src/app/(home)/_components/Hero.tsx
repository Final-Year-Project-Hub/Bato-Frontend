import CustomButton from "@/components/ui/CustomButton";
import Subheading from "@/components/ui/Subheading";
import design from "@/../public/road.png"
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="my-container mt-5 space-y-2 flex items-center">
        <div>   <Subheading content="AI Powered Learning" />
      <h1 className="max-w-4xl text-foreground text-6xl font-bold">
        Your Personalized <span className="text-primary">Coding Roadmap</span>{" "}
        Starts Here
      </h1>
      <p className="max-w-xl mt-20">
        Generate custom learning paths powered by AI. Get instant guidance from
        our intelligent chatbot and master any programming skill with
        confidence.
      </p>
      <div className="flex mt-8">
        <CustomButton
          content={
            <>
              Generate Your Roadmap <ArrowRight className="ml-2"/>
            </>
          }
        />
      </div>
      </div>
      <div>
        <Image src={design} alt="" />
      </div>
   
    </section>
  );
}
