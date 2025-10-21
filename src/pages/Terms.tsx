import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-primary">Terms & Conditions</h1>
      <div className="space-y-6 text-base leading-relaxed text-muted-foreground bg-card/80 p-6 rounded-xl border shadow">
        <section>
          <h2 className="font-semibold text-lg mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Cassiora (the "Platform"), you agree to be bound by these Terms & Conditions and all applicable laws. If you do not agree, you must not use the Platform.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">2. Description of Service</h2>
          <p>
            Cassiora provides online skill development, quiz, and interview preparation tools, including DSA, ML, AI, HR prep, communication tests, notepad, and user progress tracking.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">3. User Conduct</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use Cassiora only for lawful and educational purposes.</li>
            <li>Do not attempt to hack, disrupt, or misuse the Platform.</li>
            <li>Do not post or share offensive, illegal, or infringing content.</li>
            <li>Respect the privacy and rights of other users.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">4. Account Registration & Security</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your credentials and all activity under your account.</li>
            <li>Do not share your account or impersonate others.</li>
            <li>Cassiora may suspend or terminate accounts for violations.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">5. Intellectual Property</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>All content, branding, UI, questions, and software are the property of Cassiora or its licensors.</li>
            <li>You may not copy, distribute, or use any content for commercial purposes without written permission.</li>
            <li>User-generated content (notes, answers) remains yours, but you grant Cassiora a license to store and display it for your use.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">6. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our <Link to="/privacy" className="underline text-primary">Privacy Policy</Link> for details on how your information is handled.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">7. Limitation of Liability</h2>
          <p>
            Cassiora is provided "as is" for educational purposes. We do not guarantee accuracy or availability. We are not liable for any damages, losses, or interruptions arising from your use of the Platform.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">8. Modifications</h2>
          <p>
            We may update these Terms & Conditions at any time. Continued use of Cassiora after changes constitutes acceptance of the revised terms.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">9. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to Cassiora at our discretion, with or without notice, for any violation of these terms or misuse of the Platform.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">10. Contact</h2>
          <p>
            For questions or concerns about these Terms & Conditions, contact us through the Feedback.
          </p>
        </section>
        <div className="pt-6 border-t text-center">
          <Link to="/" className="text-primary underline hover:text-blue-600 transition">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
