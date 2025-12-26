import FAQ from "./_components/Faq";
import Features from "./_components/Features";
import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import road from "@/../public/road.png"

export default function Home(){
    return(
        <main className="">
           <Hero />
           <Features />
           <HowItWorks />
           <FAQ />
        </main>
    )
}