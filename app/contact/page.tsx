export default function ContactPage() {
  return (
    <div className="min-h-screen bg-shifting-ember py-16 sm:py-20 text-[#f7f3ee]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffae2d] drop-shadow-[0_0_18px_rgba(255,180,60,.22)]">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-[#d9cdc2]">
            Need help with a purchase, rank, or something on the Indus Realms
            network? Reach out and we will get back to you as soon as possible.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">How to Reach Us</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            For support regarding payments, ranks, coins or technical issues on
            the server, please contact us using the details below.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Support Email</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Email: <span className="font-semibold">support@indusrealms.com</span>
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            When contacting us, please include your Minecraft username, the date
            of purchase and your transaction ID (if available). This helps us
            resolve your issue faster.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Response Time</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            We aim to respond to all support requests within 24–48 hours, though
            response times may be longer during weekends or holidays.
          </p>
        </section>
      </div>
    </div>
  );
}
