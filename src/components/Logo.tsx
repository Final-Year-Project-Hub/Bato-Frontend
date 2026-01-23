import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/logo.png" 
        alt="Bato.ai Logo"
        width={106}
        height={32}
        priority
      />
    </Link>
  );
}
