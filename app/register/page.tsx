import Link from "next/link";
import CallForm from "@/components/call";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      {/* Login callout box */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-blue-800">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold hover:underline">
            Log in here
          </Link>
        </p>
      </div>

      {/* Main heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Create Your Account
        </h1>
        <p className="mt-2 text-gray-600">
          Get started with TalkwAI and never miss a call again
        </p>
      </div>

      {/* Call form */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <CallForm />
      </div>

      {/* Additional info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}