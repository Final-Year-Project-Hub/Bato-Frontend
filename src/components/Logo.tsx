// components/Logo.tsx
import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/images/logo.png" // direct path from public folder
      alt="Bato.ai Logo"
      width={106}
      height={32}
      priority
    />
  );
}

