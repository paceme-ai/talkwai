import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: January 2025</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="mb-4">
            TalkwAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
            how we collect, use, disclose, and safeguard your information when you use our AI-powered call handling 
            and automation services.
          </p>
          <p className="mb-4">
            By using our services, you consent to the data practices described in this policy. If you do not agree 
            with this policy, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Account Information:</strong> Name, email address, phone number, organization details</li>
            <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely by third-party providers)</li>
            <li><strong>Communication Data:</strong> Messages, support requests, and feedback you send to us</li>
            <li><strong>Configuration Data:</strong> Settings, preferences, and customizations for your AI assistant</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Information Automatically Collected</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Call Data:</strong> Phone numbers, call duration, timestamps, call recordings, and transcriptions</li>
            <li><strong>Usage Data:</strong> How you interact with our services, features used, and performance metrics</li>
            <li><strong>Technical Data:</strong> IP addresses, browser type, device information, and system logs</li>
            <li><strong>Analytics Data:</strong> Service performance, error reports, and usage patterns</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Third-Party Information</h3>
          <p className="mb-4">
            We may receive information about you from third-party services you connect to TalkwAI, such as 
            CRM systems, calendar applications, or other business tools.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Service Provision:</strong> To provide, maintain, and improve our AI call handling services</li>
            <li><strong>AI Training:</strong> To train and improve our AI models (using anonymized and aggregated data)</li>
            <li><strong>Personalization:</strong> To customize your experience and provide relevant features</li>
            <li><strong>Communication:</strong> To send service updates, support responses, and important notices</li>
            <li><strong>Analytics:</strong> To analyze usage patterns and improve service performance</li>
            <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
            <li><strong>Compliance:</strong> To comply with legal obligations and enforce our terms</li>
            <li><strong>Business Operations:</strong> For billing, account management, and customer support</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell, trade, or rent your personal information. We may share your information in the following circumstances:
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Service Providers</h3>
          <p className="mb-4">
            We may share information with trusted third-party service providers who assist us in operating our 
            services, such as cloud hosting, payment processing, and analytics providers.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Legal Requirements</h3>
          <p className="mb-4">
            We may disclose information when required by law, court order, or government request, or to protect 
            our rights, property, or safety.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Business Transfers</h3>
          <p className="mb-4">
            In the event of a merger, acquisition, or sale of assets, your information may be transferred as part 
            of the transaction.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">4.4 Consent</h3>
          <p className="mb-4">
            We may share information with your explicit consent or at your direction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
          <p className="mb-4">
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Encryption:</strong> Data is encrypted in transit and at rest using advanced encryption standards</li>
            <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</li>
            <li><strong>Regular Audits:</strong> Regular security assessments and vulnerability testing</li>
            <li><strong>Employee Training:</strong> Staff training on data protection and security best practices</li>
            <li><strong>Incident Response:</strong> Comprehensive incident response and breach notification procedures</li>
          </ul>
          <p className="mb-4">
            While we strive to protect your information, no method of transmission over the internet or electronic 
            storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
          <p className="mb-4">
            We retain your information for as long as necessary to provide our services and fulfill the purposes 
            outlined in this policy:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after closure</li>
            <li><strong>Call Recordings:</strong> Retained according to your settings and legal requirements (typically 30-90 days)</li>
            <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained indefinitely</li>
            <li><strong>Legal Compliance:</strong> Some data may be retained longer to comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
          <p className="mb-4">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
            <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
            <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us at privacy@talkwai.com. We will respond to your request 
            within the timeframe required by applicable law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
          <p className="mb-4">
            Your information may be transferred to and processed in countries other than your own. We ensure 
            appropriate safeguards are in place for international transfers, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Standard contractual clauses approved by relevant authorities</li>
            <li>Adequacy decisions by regulatory bodies</li>
            <li>Other legally recognized transfer mechanisms</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
          <p className="mb-4">
            Our services are not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If we become aware that we have collected such 
            information, we will take steps to delete it promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to enhance your experience:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Essential Cookies:</strong> Required for basic service functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>
          <p className="mb-4">
            You can control cookies through your browser settings, but disabling certain cookies may affect 
            service functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify you of material changes by:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Posting the updated policy on our website</li>
            <li>Sending email notifications to registered users</li>
            <li>Providing in-service notifications</li>
          </ul>
          <p className="mb-4">
            Your continued use of our services after changes become effective constitutes acceptance of the 
            updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
          <p className="mb-4">
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
            please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>TalkwAI Privacy Team</strong></p>
            <p>Email: privacy@talkwai.com</p>
            <p>Address: [Company Address]</p>
            <p>Phone: [Support Phone Number]</p>
          </div>
          <p className="mt-4">
            For EU residents, you also have the right to lodge a complaint with your local data protection authority.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex gap-4">
          <Link 
            href="/register" 
            className="text-emerald-600 hover:underline"
          >
            ← Back to Registration
          </Link>
          <Link 
            href="/terms" 
            className="text-emerald-600 hover:underline"
          >
            View Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
}