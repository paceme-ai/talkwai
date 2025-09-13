import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          One plan that scales with your business. No hidden fees, no surprises.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {/* Monthly Plan */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
            <div className="mb-4">
              <span className="text-5xl font-bold text-gray-900">$695</span>
              <span className="text-xl text-gray-600">/month</span>
            </div>
            <p className="text-gray-600">Perfect for growing businesses</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">140,000 credits included</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Credits never expire</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Use on calls, emails, and more
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Additional services added regularly
              </span>
            </div>
          </div>

          <Link
            href="/register"
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-center block"
          >
            Get Started
          </Link>
        </div>

        {/* Yearly Plan */}
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-8 shadow-sm relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              40% OFF
            </span>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Yearly</h3>
            <div className="mb-2">
              <span className="text-5xl font-bold text-gray-900">$5,000</span>
              <span className="text-xl text-gray-600">/year</span>
            </div>
            <div className="mb-4">
              <span className="text-lg text-gray-500 line-through">$8,340</span>
              <span className="text-lg text-emerald-600 font-semibold ml-2">
                Save $3,340
              </span>
            </div>
            <p className="text-gray-600">
              Best value for established businesses
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">140,000 credits per month</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Credits never expire</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Use on calls, emails, and more
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Additional services added regularly
              </span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700 font-semibold">
                40% savings vs monthly
              </span>
            </div>
          </div>

          <Link
            href="/register"
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-center block"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Guarantees Section */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Our Guarantees
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Price Guarantee
            </h3>
            <p className="text-gray-600">
              We will never increase our cost per credit. Your investment is
              protected as we scale.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Satisfaction Guarantee
            </h3>
            <p className="text-gray-600">
              We will refund any unused credits at their purchase price. No
              questions asked.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What are credits and how do they work?
            </h3>
            <p className="text-gray-600">
              Credits are our universal currency for all TalkwAI services. Use
              them for AI calls, email automation, and any new features we add.
              Credits never expire, so you can use them at your own pace.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I change my plan later?
            </h3>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Unused
              credits will carry over, and we'll prorate any billing
              differences.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What new services are you adding?
            </h3>
            <p className="text-gray-600">
              We're constantly expanding our AI capabilities. Upcoming features
              include advanced email automation, CRM integrations, and custom AI
              workflows. All will use the same credit system.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Is there a free trial?
            </h3>
            <p className="text-gray-600">
              We offer a satisfaction guarantee instead of a traditional trial.
              If you're not completely satisfied, we'll refund any unused
              credits at their full purchase price.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to get started?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of businesses automating their communications with AI.
        </p>
        <Link
          href="/register"
          className="inline-block bg-emerald-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-lg"
        >
          Start Your Journey
        </Link>
      </div>
    </main>
  );
}
