import FAQ from "./_components/Faq";
import Features from "./_components/Features";
import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";

export default function Home() {
  return (
    <main>
      <section id="home">
        <Hero />
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <section id="faq">
        <FAQ />
      </section>
    </main>
  );
}