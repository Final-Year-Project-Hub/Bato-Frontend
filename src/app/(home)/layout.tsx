
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
    
        <NavBar />
        {children}
        <Footer />
\    </main>
  );
}
