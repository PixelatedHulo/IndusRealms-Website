export default function TermsPage() {
  return (
    <div className="min-h-screen bg-shifting-ember py-16 sm:py-20 text-[#f7f3ee]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffae2d] drop-shadow-[0_0_18px_rgba(255,180,60,.22)]">
            Terms &amp; Conditions
          </h1>
          <p className="text-lg sm:text-xl text-[#d9cdc2]">
            By accessing or using the Indus Realms website or Minecraft server,
            you agree to be bound by these Terms &amp; Conditions.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Digital Goods</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Indus Realms sells digital in-game items such as ranks, coins, crate
            keys and cosmetics. These items grant virtual benefits on our
            Minecraft server and have no real-world monetary value.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            All purchases are final and non-refundable as described in our Refund
            &amp; Cancellation Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">
            Server Rules &amp; Enforcement
          </h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Players must follow all posted server rules. Breaking the rules may
            result in warnings, temporary bans, permanent bans or removal of
            purchased items at the staff team’s discretion.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Punishments for rule violations do not entitle the player to a refund
            or compensation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Payments &amp; Chargebacks</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            You must be the authorised account holder or have permission from the
            account holder to make a purchase.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Unauthorised payments, fraudulent activity or chargebacks may result
            in permanent account suspension and removal of all in-game items.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Delivery of Items</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            In-game items are usually delivered automatically after a successful
            payment. In rare cases it may take up to 10 minutes for items to
            appear.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            If you do not receive your items after this time, please contact
            support with your Minecraft username and transaction ID.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">
            Changes to These Terms
          </h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            We may update these Terms &amp; Conditions from time to time.
            Continued use of the website or server after changes are posted means
            you accept the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
