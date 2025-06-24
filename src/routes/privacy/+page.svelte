<script lang="ts">
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>Privacy Policy - TrueForm</title>
  <meta
    name="description"
    content="TrueForm Privacy Policy - How we collect, use, and protect your personal information."
  />
</svelte:head>

<div class="privacy-policy">
  <div class="container">
    <h1>Privacy Policy</h1>
    <p class="last-updated">Last updated: January 21, 2025</p>

    <section>
      <h2>1. Information We Collect</h2>

      <h3>Personal Information</h3>
      <p>When you use TrueForm services, we may collect:</p>
      <ul>
        <li>
          <strong>Contact Information:</strong> Name, email address, phone number,
          business address
        </li>
        <li>
          <strong>Business Information:</strong> Company name, industry, project
          requirements, design preferences
        </li>
        <li>
          <strong>Payment Information:</strong> Billing address, payment method details
          (processed securely through Stripe)
        </li>
        <li>
          <strong>Communication Data:</strong> Messages, project feedback, support
          requests
        </li>
      </ul>

      <h3>Technical Information</h3>
      <ul>
        <li>
          <strong>Usage Data:</strong> Pages visited, time spent, interaction patterns
        </li>
        <li>
          <strong>Device Information:</strong> Browser type, operating system, IP
          address
        </li>
        <li>
          <strong>Cookies:</strong> Session data, preferences, authentication tokens
        </li>
      </ul>
    </section>

    <section>
      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide website development and design services</li>
        <li>Communicate about your project and provide customer support</li>
        <li>Process payments and manage billing</li>
        <li>Improve our services and develop new features</li>
        <li>Send important updates about your project or account</li>
        <li>Comply with legal obligations</li>
      </ul>
    </section>

    <section>
      <h2>3. Information Sharing</h2>
      <p>
        We do not sell, trade, or rent your personal information. We may share
        information only:
      </p>
      <ul>
        <li>
          <strong>With your consent</strong> for specific purposes you approve
        </li>
        <li>
          <strong>Service Providers:</strong> Stripe (payments), Supabase (data hosting),
          Vercel (website hosting)
        </li>
        <li>
          <strong>Legal Requirements:</strong> When required by law or to protect
          our rights
        </li>
        <li>
          <strong>Business Transfers:</strong> In case of merger, acquisition, or
          sale of assets
        </li>
      </ul>
    </section>

    <section>
      <h2>4. Data Security</h2>
      <p>We implement industry-standard security measures:</p>
      <ul>
        <li>HTTPS encryption for all data transmission</li>
        <li>Secure database hosting with row-level security</li>
        <li>Regular security audits and vulnerability assessments</li>
        <li>Limited access to personal data on a need-to-know basis</li>
        <li>Secure payment processing through PCI-compliant providers</li>
      </ul>
    </section>

    <section>
      <h2>5. Your Rights (GDPR & CCPA)</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of your personal data</li>
        <li>
          <strong>Rectification:</strong> Correct inaccurate or incomplete information
        </li>
        <li>
          <strong>Erasure:</strong> Request deletion of your personal data
        </li>
        <li>
          <strong>Portability:</strong> Receive your data in a machine-readable format
        </li>
        <li>
          <strong>Objection:</strong> Object to processing of your personal data
        </li>
        <li>
          <strong>Withdraw Consent:</strong> Withdraw consent for data processing
        </li>
      </ul>
      <p>
        To exercise these rights, contact us at <a
          href="mailto:privacy@trueform.digital">privacy@trueform.digital</a
        >
      </p>
    </section>

    <section>
      <h2>6. Data Retention</h2>
      <p>We retain personal information:</p>
      <ul>
        <li>
          <strong>Active Clients:</strong> For the duration of our service relationship
        </li>
        <li>
          <strong>Project Data:</strong> 7 years after project completion for business
          records
        </li>
        <li>
          <strong>Marketing Data:</strong> Until you unsubscribe or request deletion
        </li>
        <li>
          <strong>Payment Data:</strong> As required by financial regulations (typically
          7 years)
        </li>
      </ul>
    </section>

    <section>
      <h2>7. Cookies and Tracking</h2>
      <p>We use cookies for:</p>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> Authentication, security, basic site
          functionality
        </li>
        <li>
          <strong>Analytics:</strong> Understanding site usage and improving user
          experience
        </li>
        <li>
          <strong>Preferences:</strong> Remembering your settings and preferences
        </li>
      </ul>
      <p>
        You can control cookies through your browser settings, but this may
        affect site functionality.
      </p>
    </section>

    <section>
      <h2>8. Third-Party Services</h2>
      <p>We use these trusted third-party services:</p>
      <ul>
        <li>
          <strong>Stripe:</strong> Payment processing (see
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener"
            >Stripe Privacy Policy</a
          >)
        </li>
        <li>
          <strong>Supabase:</strong> Database and authentication (see
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener"
            >Supabase Privacy Policy</a
          >)
        </li>
        <li>
          <strong>Vercel:</strong> Website hosting (see
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener">Vercel Privacy Policy</a
          >)
        </li>
      </ul>
    </section>

    <section>
      <h2>9. International Data Transfers</h2>
      <p>
        Your data may be transferred to and processed in countries other than
        your own. We ensure adequate protection through:
      </p>
      <ul>
        <li>Standard Contractual Clauses (SCCs) with service providers</li>
        <li>Adequacy decisions by relevant data protection authorities</li>
        <li>Other appropriate safeguards as required by law</li>
      </ul>
    </section>

    <section>
      <h2>10. Children's Privacy</h2>
      <p>
        Our services are not intended for children under 16. We do not knowingly
        collect personal information from children under 16. If you believe we
        have collected such information, please contact us immediately.
      </p>
    </section>

    <section>
      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. We will notify you of
        material changes by:
      </p>
      <ul>
        <li>Posting the updated policy on our website</li>
        <li>Sending email notification to registered users</li>
        <li>Updating the "Last updated" date at the top of this policy</li>
      </ul>
    </section>

    <section>
      <h2>12. Contact Information</h2>
      <p>For privacy-related questions or requests:</p>
      <div class="contact-info">
        <p>
          <strong>Email:</strong>
          <a href="mailto:privacy@trueform.digital">privacy@trueform.digital</a>
        </p>
        <p>
          <strong>Address:</strong> TrueForm Digital Solutions<br />
          1234 Business Street<br />
          Austin, TX 78701<br />
          United States
        </p>
      </div>
    </section>
  </div>
</div>

<style>
  .privacy-policy {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    line-height: 1.6;
    color: #374151;
  }

  .container h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .last-updated {
    color: #6b7280;
    font-style: italic;
    margin-bottom: 2rem;
  }

  section {
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
    margin-top: 2rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    margin-top: 1.5rem;
  }

  ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #3b82f6;
    text-decoration: underline;
  }

  a:hover {
    color: #1d4ed8;
  }

  .contact-info {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-top: 1rem;
  }

  .contact-info p {
    margin-bottom: 0.5rem;
  }

  @media (max-width: 640px) {
    .privacy-policy {
      padding: 1rem;
    }

    .container h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.25rem;
    }
  }
</style>
