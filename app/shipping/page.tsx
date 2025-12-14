export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-shifting-ember py-16 sm:py-20 text-[#f7f3ee]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffae2d] drop-shadow-[0_0_18px_rgba(255,180,60,.22)]">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-lg sm:text-xl text-[#d9cdc2]">
            This Shipping &amp; Delivery Policy describes how and when digital
            items purchased from Indus Realms are provided to you.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Digital Products Only</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            All products sold through the Indus Realms store are digital goods
            that provide virtual benefits on our Minecraft server.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            We do not ship any physical items and no physical delivery will take
            place.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Delivery Time</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            In most cases, your digital items are delivered automatically within a
            few minutes of a successful payment.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            During periods of high load or technical issues, delivery may be
            delayed. If you have not received your items within 10 minutes, please
            contact support.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Method of Delivery</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Items are delivered directly to the Minecraft account username
            provided at checkout.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Please ensure that you enter your correct Minecraft username. We are
            not responsible for items delivered to an incorrect username entered
            by the customer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Support</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            If you experience any issues with delivery, please email{" "}
            <span className="font-semibold">support@indusrealms.com</span> with
            your Minecraft username and transaction ID so we can assist you.
          </p>
        </section>
      </div>
    </div>
  );
}
