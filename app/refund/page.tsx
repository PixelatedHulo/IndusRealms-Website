import React from "react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-shifting-ember py-16 sm:py-20 text-[#f7f3ee]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffae2d] drop-shadow-[0_0_18px_rgba(255,180,60,.22)]">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-lg sm:text-xl text-[#d9cdc2]">
            All purchases on Indus Realms are for digital in-game items delivered
            instantly on our Minecraft server.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">General Policy</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Because all products sold on Indus Realms (ranks, coins, crate keys,
            passes and other digital goods) are delivered instantly, all sales
            are final.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            By completing a purchase, you agree that you will not be eligible for
            a refund, return or exchange once the payment is processed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Non-Refundable Purchases</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            The following purchases are non-refundable: ranks or rank upgrades,
            coins or virtual currency, crate keys or lootboxes, cosmetics,
            passes or any other digital entitlements.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Refunds are also not provided for downtime, maintenance, lost
            progress, bans or punishments for breaking the server rules, or
            purchases made for the wrong Minecraft username.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Chargebacks</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            Opening a chargeback or payment dispute after receiving your items is
            considered fraud.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            If a chargeback is initiated, we reserve the right to permanently ban
            your Minecraft account from our services and remove any purchased
            items while also contesting the dispute with our payment processor.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-[#ffd580]">Payment Issues</h2>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            If you experience a technical issue with your payment or do not
            receive your items within a reasonable time, please contact us before
            attempting a chargeback.
          </p>
          <p className="text-base leading-relaxed text-[#f7f3ee]/90">
            You can reach us at <span className="font-semibold">support@indusrealms.com</span>{" "}
            with your Minecraft username, transaction ID and a description of the
            issue.
          </p>
        </section>

      </div>
    </div>
  );
}
