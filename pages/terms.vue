<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">
      Terms of Service
    </h1>

    <div class="prose prose-gray max-w-none">
      <p class="text-gray-600 mb-8">
        <strong>Last updated:</strong> {{ new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
      </p>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Acceptance of Terms
        </h2>
        <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Use License
        </h2>
        <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul class="list-disc pl-6 mt-2">
          <li>modify or copy the materials</li>
          <li>use the materials for any commercial purpose</li>
          <li>attempt to decompile or reverse engineer any software contained on our website</li>
          <li>remove any copyright or other proprietary notations from the materials</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          User Accounts
        </h2>
        <p>To use certain features of our service, you may be required to create an account. You are responsible for:</p>
        <ul class="list-disc pl-6 mt-2">
          <li>Maintaining the confidentiality of your account password</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized use of your account</li>
        </ul>

        <p class="mt-4">
          We use Google for authentication. By creating an account, you agree to Google's terms of service and privacy policy.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Payment Terms
        </h2>
        <p>We use Stripe to process payments. By purchasing our services, you agree to:</p>
        <ul class="list-disc pl-6 mt-2">
          <li>Provide accurate payment information</li>
          <li>Pay all fees associated with your account</li>
          <li>Comply with Stripe's terms of service</li>
        </ul>

        <p class="mt-4">
          All sales are final. We reserve the right to modify our pricing at any time.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Prohibited Activities
        </h2>
        <p>You may not use our service to:</p>
        <ul class="list-disc pl-6 mt-2">
          <li>Upload or transmit malicious code</li>
          <li>Interfere with or disrupt the service or servers</li>
          <li>Harass, abuse, or harm another person</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on the rights of others</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Intellectual Property
        </h2>
        <p>All materials on this website are owned by or licensed to us and are protected by copyright, trademark, and other intellectual property laws. You may not use our trademarks without our prior written permission.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Analytics
        </h2>
        <p>We use Vercel Analytics to collect anonymous usage data. This data helps us improve our service and user experience. By using our service, you consent to the collection and use of this data in accordance with our privacy policy.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Disclaimer
        </h2>
        <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Limitations
        </h2>
        <p>In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Termination
        </h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Governing Law
        </h2>
        <p>These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Changes to Terms
        </h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">
          Contact Us
        </h2>
        <p>If you have any questions about these terms of service, please contact us at terms@example.com.</p>
      </section>
    </div>
  </div>
</template>
