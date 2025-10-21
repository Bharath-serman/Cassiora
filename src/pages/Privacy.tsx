import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-primary">Privacy Policy</h1>
      <div className="space-y-6 text-base leading-relaxed text-muted-foreground bg-card/80 p-6 rounded-xl border shadow">
        <section>
          <h2 className="font-semibold text-lg mb-2">1. Introduction</h2>
          <p>
            Cassiora ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account Information:</strong> Email, username, and password when you register.</li>
            <li><strong>User Content:</strong> Notes, answers, feedback, and activity logs created by you.</li>
            <li><strong>Usage Data:</strong> Device, browser, IP address, and interaction logs to improve your experience.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide, personalize, and improve your experience on Cassiora.</li>
            <li>To maintain platform security and prevent misuse.</li>
            <li>To communicate important updates, support messages, or respond to your feedback.</li>
            <li>To analyze usage trends and improve platform features.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">4. Data Sharing</h2>
          <p>
            We do <strong>not</strong> sell or rent your data. We may share data with trusted service providers (such as hosting, analytics, or email services) only as necessary to operate Cassiora, and always under strict confidentiality agreements.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">5. Data Security</h2>
          <p>
            We use industry-standard security measures to protect your information. However, no system is 100% secure, and you use Cassiora at your own risk.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">6. Your Rights & Choices</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You can access, update, or delete your account at any time through your profile settings.</li>
            <li>You may request deletion of your data by contacting us through the Feedback.</li>
            <li>You may opt out of non-essential communications at any time.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">7. Children's Privacy</h2>
          <p>
            Cassiora is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us information, please contact us for removal.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">8. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes via the website or email.
          </p>
        </section>
        <div className="pt-6 border-t text-center">
          <Link to="/" className="text-primary underline hover:text-blue-600 transition">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
