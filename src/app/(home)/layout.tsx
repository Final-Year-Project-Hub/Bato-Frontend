
import NavBar from "@/components/ui/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/ui/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NavBar />
        {children}
        <Footer />
      </ThemeProvider>
    </main>
  );
}
