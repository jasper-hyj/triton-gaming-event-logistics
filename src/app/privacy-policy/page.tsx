// app/privacy-policy/page.tsx

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        This Privacy Policy explains how we collect, use, and protect your
        information when you use our website and sign in with third-party
        providers (such as Google) using OAuth2.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Information We Collect
      </h2>
      <p className="mb-4">
        When you sign in using a third-party OAuth provider like Google, we may
        collect the following information:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Your name</li>
        <li>Your email address</li>
        <li>Your profile picture (if provided)</li>
        <li>
          Basic authentication information required for login and session
          management
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        How We Use Your Information
      </h2>
      <p className="mb-4">We use your information to:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Authenticate you and manage your login session</li>
        <li>Provide personalized services and features</li>
        <li>Improve the functionality and security of our application</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        Data Sharing and Storage
      </h2>
      <p className="mb-4">
        We do not sell or share your personal information with third parties
        except as required by law or necessary to operate our service. Your data
        is stored securely using our backend services and authentication
        provider (Supabase), which complies with industry security standards.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Services</h2>
      <p className="mb-4">
        We use third-party OAuth2 providers (such as Google) for authentication.
        Their use of your data is governed by their own privacy policies:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          <a
            className="text-blue-600 underline"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
      <p className="mb-4">
        You may request to access, update, or delete your personal data at any
        time by contacting us. You may also revoke your OAuth authorization from
        your Google account settings.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this privacy policy or how your data is
        handled, please contact us at:{" "}
        <a
          href="mailto:jasper.hyj@gmail.com"
          className="text-blue-600 underline"
        >
          jasper.hyj@gmail.com
        </a>
      </p>

      <p className="text-sm text-gray-500 mt-12">Last updated: June 6, 2025</p>
    </main>
  );
}
