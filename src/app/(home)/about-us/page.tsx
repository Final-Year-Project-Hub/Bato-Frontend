import Subheading from "@/components/ui/Subheading";

export default function Page() {
  return (
    <main className="my-container">
      <section className="bg-background">
        <div className="my-container py-20">
          <div className="flex flex-col items-center">
            <Subheading content="About Us"
            />
            <h1 className="heading mb-2">
              <span className="text-primary">Building smarter</span> learning
              experiences with AI.
            </h1>
            <p>
              Personalized roadmaps, intelligent guidance, and structured
              learning—designed for modern learners.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
