const PrivacyAndPolicy = () => {
  return (
    <div className="prose max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p><strong>Last Updated:</strong> January 1, 2025</p>

      <p className="mt-4">
        This Privacy Policy explains how <strong>Constil</strong> ("Constil", "we", "our", or "us")
        collects, uses, and protects information when you use our AI-powered construction
        estimation platform available at <strong> <a
    href="https://constil.com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline"
  >
    https://constil.com
  </a></strong>.
      </p>

      <h2 className="mt-6 font-bold">1. Information We Collect</h2>

      <p><strong>Account Information:</strong> Name, email address, business name, and encrypted password.</p>

      <p><strong>Project Data:</strong> Blueprints, construction specifications, cost estimates, and material quantities uploaded by users.</p>

      <p><strong>Billing Information:</strong> Payment information is processed securely through Stripe. Payment card data is not stored on our servers.</p>

      <p><strong>Usage Data:</strong> IP address, browser type, device information, and platform usage analytics.</p>

      <h2 className="mt-6 font-bold">2. How We Use Your Information</h2>

      <p>We use your information to:</p>
      <ul>
        <li>Create and manage user accounts</li>
        <li>Generate AI-powered construction estimates</li>
        <li>Improve platform performance and accuracy</li>
        <li>Process subscriptions and payments</li>
        <li>Provide customer support and communicate updates</li>
        <li>Ensure platform security and prevent fraud</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="mt-6 font-bold">3. Third-Party Services</h2>
      <p>
        We use trusted third-party services including Stripe for payment processing,
        cloud hosting providers, and analytics tools to operate and improve our platform.
      </p>

      <h2 className="mt-6 font-bold">4. Data Retention</h2>
      <p>
        We retain your information while your account is active or as necessary to comply
        with legal obligations, resolve disputes, and enforce our agreements.
      </p>

      <h2 className="mt-6 font-bold">5. Data Security</h2>
      <p>
        We implement industry-standard security measures including HTTPS encryption,
        secure hosting infrastructure, and restricted data access to protect your information.
      </p>

      <h2 className="mt-6 font-bold">6. Your Rights</h2>
      <p>
        You may request access, correction, or deletion of your personal data by contacting us at:
      </p>
      <p><strong>support@constil.com</strong></p>

      <h2 className="mt-6 font-bold">7. International Data Transfers</h2>
      <p>
        Your information may be processed and stored in countries where our infrastructure
        or service providers operate.
      </p>

      <h2 className="mt-6 font-bold">8. Children's Privacy</h2>
      <p>
        Our services are not intended for individuals under 13 years of age. We do not knowingly
        collect personal data from children.
      </p>

      <h2 className="mt-6 font-bold">9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Continued use of the platform
        after changes indicates your acceptance of the updated policy.
      </p>

   <h2 className="mt-6 font-bold">10. Contact</h2>
<p>
  If you have any questions regarding this Privacy Policy, please contact us:
</p>

<p>
  <strong>Constil</strong><br />

  Website:{" "}
  <a
    href="https://constil.com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline"
  >
    https://constil.com
  </a>
  <br />

  Email:{" "}
  <a
    href="mailto:support@constil.com"
    className="text-blue-600 underline"
  >
    support@constil.com
  </a>
</p>
    </div>
  );
};

export default PrivacyAndPolicy;