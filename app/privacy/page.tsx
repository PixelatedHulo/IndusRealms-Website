export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-shifting-ember py-16 sm:py-20 text-[#f7f3ee]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffae2d] drop-shadow-[0_0_18px_rgba(255,180,60,.22)]">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl text-[#d9cdc2]">
            This Privacy Policy explains what information we collect when you use
            Indus Realms and how we use and protect that information.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Information We Collect</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            When you use our website or make a purchase, we may collect your
            Minecraft username, email address (if provided), IP address and basic
            server usage information.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Payment information such as card or banking details is processed
            securely by our payment partners (such as Razorpay) and is not stored
            on Indus Realms servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">How We Use Your Information</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            We use the information we collect to deliver your in-game items,
            verify and process payments, provide customer support and maintain the
            security and stability of our services.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            We may also use non-identifying information to improve the website and
            overall player experience.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Data Sharing</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            We do not sell, rent or trade your personal information to third
            parties.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Information may be shared with service providers such as payment
            gateways or hosting providers only as necessary to operate our
            services and only under appropriate safeguards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Security</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            We take reasonable technical and organisational measures to protect
            your information from unauthorised access, loss or misuse. However, no
            method of transmission over the Internet or electronic storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Contact About Privacy</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            If you have any questions about this Privacy Policy or how we handle
            your data, please contact us at{" "}
            <span className="font-semibold">support@indusrealms.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
