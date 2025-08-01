<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">
      Privacy Policy
    </h1>

    <div class="prose prose-gray max-w-none">
      <p class="text-gray-600 mb-8">
        <strong>Last updated:</strong> {{ new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
      </p>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Information We Collect
        </h2>
        <p>We collect information to provide better services to all our users. This includes:</p>
        <ul class="list-disc pl-6 mt-2">
          <li><strong>Personal Information:</strong> Name, email address, and profile information when you create an account</li>
          <li><strong>Usage Data:</strong> Information about how you use our service, including your IP address, browser type, and pages visited</li>
          <li><strong>Cookies:</strong> Small data files stored on your device to enhance your experience</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul class="list-disc pl-6 mt-2">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Third-Party Services
        </h2>
        <p>Our service uses third-party services that may collect information about you:</p>

        <h3 class="text-xl font-medium mt-4 mb-2">
          Google Authentication
        </h3>
        <p>We use Google for user authentication. When you sign in with Google, we receive certain information from Google, including your name, email address, and profile picture. Google's privacy policy governs their use of your information.</p>

        <h3 class="text-xl font-medium mt-4 mb-2">
          Stripe Payment Processing
        </h3>
        <p>We use Stripe to process payments. When you make a purchase, Stripe collects your payment information. We do not store your payment details on our servers. Stripe's privacy policy governs their use of your information.</p>

        <h3 class="text-xl font-medium mt-4 mb-2">
          Vercel Analytics
        </h3>
        <p>We use Vercel Analytics to understand how users interact with our service. This helps us improve our product and user experience. Vercel Analytics collects anonymous usage data and does not personally identify you.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Data Security
        </h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Your Rights
        </h2>
        <p>You have the right to:</p>
        <ul class="list-disc pl-6 mt-2">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Children's Privacy
        </h2>
        <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Changes to This Policy
        </h2>
        <p>We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Contact Us
        </h2>
        <p>If you have any questions about this privacy policy, please contact us at privacy@example.com.</p>
      </section>
    </div>
  </div>
</template>
