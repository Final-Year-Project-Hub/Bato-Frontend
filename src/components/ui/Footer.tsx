import Image from "next/image";
import logo from "@/../public/logo.svg";
import { Instagram, Mail, Phone, Send } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/about", label: "About us" },
  { href: "/home", label: "Home" },
  { href: "/", label: "How It Works" },
  { href: "/contact", label: "Contact us" },
];
const socials = [
  {
    href: "https://instagram.com/yourhandle",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "tel:+9779888888888",
    label: "Call us",
    icon: Phone,
  },
  {
    href: "mailto:hello@example.com",
    label: "Email us",
    icon: Mail,
  },
];
export default function Footer() {
  return (
    <footer className="w-full h-full overflow-hidden pt-20 bg-background">

      <div className="relative z-10 container mx-auto max-w-7xl xl:max-w-430">
        <div className="my-container grid grid-cols-1 lg:grid-cols-2 gap-5 pb-8">
          <div className="max-w-md">
            <Image
              src={logo}
              alt="logo"
              priority
              width={284}
              height={67}
              className="w-1/2 sm:w-71 h-auto"
            />
            <div className="text-left pt-4">
              <p className="text-foreground text-lg">
                An advanced digital platform that redefines how learners and
                developers engage with technical education.
              </p>
            
            </div>
          </div>
          {/* Sitemap and contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-10 lg:mt-0 ">
            {/* Sitemap section */}
            <div>
              <p className="text-primary font-outfit font-bold text-lg pb-4">
                SITEMAP
              </p>
              <ul className="space-y-3 text-lg font-poppins text-foreground">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact section */}
            <div>
              <p className="text-primary font-bold text-lg pb-4 mt-10 lg:mt-0">
                Contact
              </p>
              <ul className="space-y-3 text-lg  text-foreground">
                <li className="flex cursor-pointer gap-2">
                  <Phone strokeWidth={1} />
                  +97 8989999891
                </li>
                <li className="flex cursor-pointer gap-2">
                  <Send strokeWidth={1} /> batoai.com
                </li>
              </ul>
              <div className="flex gap-3 mt-10">
                {socials.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    aria-label={label}
                    className="inline-flex items-center justify-center border border-gray-200 rounded-full p-4 hover:border-primary hover:bg-primary-foreground group"
                  >
                    <Icon
                      size={24}
                      strokeWidth={1}
                      className="text-foreground group-hover:text-primary"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* below footer */}
        <div
          className="w-full border-t border-border"
        />
        <div className="my-container flex flex-wrap justify-between py-3 text-sm text-gray-600 space-y-3 lg:space-y-0">
          <p>© {new Date().getFullYear()} Bato.ai. All rights reserved.</p>
          <div className="flex flex-wrap space-x-3 ">
            <Link
              href="/contact"
              className="border-r pr-3 mr-3 hover:underline cursor-pointer"
            >
              Contact us
            </Link>
            <Link
              href="/terms"
              className="border-r pr-3 mr-3 hover:underline cursor-pointer"
            >
              Terms and Conditions
            </Link>
            <Link href="/privacy" className="hover:underline cursor-pointer">
              Privacy Policy
            </Link>
          </div>
          <div>
            Powered by:{" "}
            <Link
              href="https://bato.ai.com.np/"
              target="_blank"
              className="text-primary cursor-pointer font-semibold"
            >
              Bato.ai
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
