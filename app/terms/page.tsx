import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600">Last updated: January 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing and using TalkwAI's services, you accept and agree to
            be bound by the terms and provision of this agreement. If you do not
            agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Service Description
          </h2>
          <p className="mb-4">
            TalkwAI provides AI-powered call handling and automation services
            for businesses. Our services include but are not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Automated call answering and routing</li>
            <li>AI-powered customer service interactions</li>
            <li>Call transcription and analysis</li>
            <li>Integration with business systems and workflows</li>
            <li>Custom AI voice assistants for specific business needs</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. User Accounts and Registration
          </h2>
          <p className="mb-4">
            To access certain features of our service, you must register for an
            account. You agree to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Provide accurate, current, and complete information during
              registration
            </li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>
              Notify us immediately of any unauthorized use of your account
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Acceptable Use Policy
          </h2>
          <p className="mb-4">You agree not to use TalkwAI's services to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>
              Transmit harmful, threatening, abusive, or defamatory content
            </li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt our services</li>
            <li>
              Use our services for spam, phishing, or other malicious activities
            </li>
            <li>Impersonate any person or entity</li>
            <li>Collect personal information without consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Payment Terms
          </h2>
          <p className="mb-4">
            Payment for TalkwAI services is due according to the billing
            schedule selected during registration. We reserve the right to
            suspend or terminate services for non-payment. All fees are
            non-refundable unless otherwise specified in writing.
          </p>
          <p className="mb-4">
            We may change our pricing at any time with 30 days' notice to
            existing customers. Price changes will not affect your current
            billing cycle.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Data and Privacy
          </h2>
          <p className="mb-4">
            Your privacy is important to us. Our collection and use of personal
            information is governed by our
            <Link href="/privacy" className="text-emerald-600 hover:underline">
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </p>
          <p className="mb-4">
            You retain ownership of your data. We process your data solely to
            provide our services and as described in our Privacy Policy. We
            implement industry-standard security measures to protect your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Intellectual Property
          </h2>
          <p className="mb-4">
            TalkwAI and its licensors own all rights, title, and interest in and
            to the service, including all intellectual property rights. You may
            not copy, modify, distribute, sell, or lease any part of our
            services or included software.
          </p>
          <p className="mb-4">
            You grant us a limited license to use, store, and process your
            content solely for the purpose of providing our services to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Service Availability
          </h2>
          <p className="mb-4">
            We strive to maintain high service availability but cannot guarantee
            uninterrupted service. We may perform maintenance, updates, or
            modifications that temporarily affect service availability.
          </p>
          <p className="mb-4">
            We are not liable for any damages resulting from service
            interruptions, including but not limited to lost revenue, data, or
            business opportunities.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            9. Limitation of Liability
          </h2>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, TALKWAI SHALL NOT BE LIABLE
            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE,
            GOODWILL, OR OTHER INTANGIBLE LOSSES.
          </p>
          <p className="mb-4">
            Our total liability to you for any claim arising out of or relating
            to these terms or our services shall not exceed the amount you paid
            us in the twelve months preceding the claim.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            10. Termination
          </h2>
          <p className="mb-4">
            Either party may terminate this agreement at any time with or
            without cause. Upon termination:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your access to our services will cease immediately</li>
            <li>
              We will delete your data according to our data retention policy
            </li>
            <li>You remain liable for any outstanding fees</li>
            <li>
              Provisions that by their nature should survive termination will
              remain in effect
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            11. Governing Law
          </h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with
            the laws of the jurisdiction where TalkwAI is incorporated, without
            regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            12. Changes to Terms
          </h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will
            notify users of material changes via email or through our service.
            Continued use of our services after changes constitutes acceptance
            of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            13. Contact Information
          </h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>
              <strong>TalkwAI Support</strong>
            </p>
            <p>Email: legal@talkwai.com</p>
            <p>Address: [Company Address]</p>
          </div>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/register" className="text-emerald-600 hover:underline">
          ← Back to Registration
        </Link>
      </div>
    </main>
  );
}
