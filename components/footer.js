import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-gray-600 flex flex-wrap items-center justify-between gap-3">
        <span>
          © {new Date().getFullYear()} TalkwAI • Helping businesses talk with AI
        </span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-emerald-700">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-emerald-700">
            Terms
          </Link>
          <Link href="/status" className="hover:text-emerald-700">
            Status
          </Link>
          <Link href="/contact" className="hover:text-emerald-700">
            Contact
          </Link>
          <Link href="/blog" className="hover:text-emerald-700">
            Blog
          </Link>
          <Link href="/faq" className="hover:text-emerald-700">
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
}
