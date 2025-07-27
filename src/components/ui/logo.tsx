import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 relative w-36 h-10">
      <Image src="/brand.png" alt="SyncPad" fill className="object-cover" />
    </Link>
  );
}
