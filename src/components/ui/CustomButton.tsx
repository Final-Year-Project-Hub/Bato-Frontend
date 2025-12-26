import Link from "next/link";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface CustomButtonProps {
  content: React.ReactNode;
  href?: string;
  download?: boolean | string;
  variant?: "primary" | "black" | "transparent";
  size?: "sm" | "md" | "lg";
  className?: string;
  asChild?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export default function CustomButton({
  content,
  href,
  download,
  variant = "primary",
  size = "md",
  className,
  asChild = false,

  onClick,
}: CustomButtonProps) {
  const Comp = asChild ? Slot : "button";

  const variantClasses = {
    primary:
      "bg-primary text-white cursor-pointer flex items-center hover:opacity-80",
    transparent:
      "bg-white text-black cursor-pointer flex items-center hover:opacity-80 border border-black/30",
    black:
      "bg-heading text-white  cursor-pointer flex items-center hover:opacity-80",
  };

  const sizeClasses = {
    sm: "px-2 py-3 text-sm",
    md: "px-8 py-3 text-lg",
    lg: "px-6 sm:px-5 py-3 sm:py-3 text-base sm:text-lg ",
  };

  const baseClass = cn(
    variantClasses[variant],
    sizeClasses[size],
    "rounded-sm font-semibold cursor-pointer font-pro transition-all duration-300 ease-in-out",
    className
  );
  if (href && download) {
    return (
      <a
        href={href}
        download={download === true ? undefined : (download as string)}
        className={baseClass}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={baseClass} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <Comp className={baseClass} onClick={onClick}>
      {content}
    </Comp>
  );
}
