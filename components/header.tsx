import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="TalkwAI Logo"
              width={123}
              height={30}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(8%) sepia(8%) saturate(1171%) hue-rotate(314deg) brightness(95%) contrast(95%)",
              }}
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#how" className="hover:text-emerald-700">
            How it works
          </Link>
          <Link href="#solution" className="hover:text-emerald-700">
            Casey
          </Link>
          <Link href="/pricing" className="hover:text-emerald-700">
            Pricing
          </Link>
          <Link href="#contact" className="hover:text-emerald-700">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm hover:text-emerald-700">
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
