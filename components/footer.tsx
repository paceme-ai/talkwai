import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-4 text-sm text-gray-600 flex flex-wrap-reverse items-center justify-between gap-3">
        <span>
          © {new Date().getFullYear()} TalkwAI • Helping businesses talk with AI
        </span>
        <div className="flex gap-4">
          <Link href="/pricing" className="hover:text-emerald-700">
            Pricing
          </Link>
          <Link href="/terms" className="hover:text-emerald-700">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-emerald-700">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
