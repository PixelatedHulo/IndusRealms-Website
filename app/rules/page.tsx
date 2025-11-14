import rulesConfig from "@/config/rules.json";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-shifting-ember py-16 sm:py-20 text-[#f7f3ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1
            className="text-4xl sm:text-5xl font-extrabold mb-6
                       text-[#ffae2d] drop-shadow-[0_0_18px_rgba(255,180,60,.22)]"
          >
            {rulesConfig.title}
          </h1>
          <p className="text-lg sm:text-xl text-[#d9cdc2] max-w-3xl mx-auto">
            {rulesConfig.description}
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {rulesConfig.categories.map((category, index) => (
            <div
              key={index}
              className="
                p-6 sm:p-8 rounded-[22px] backdrop-blur-sm
                border border-[rgba(255,166,66,0.10)]
                shadow-[0_8px_28px_rgba(0,0,0,0.55)]
                bg-[linear-gradient(180deg,rgba(26,16,11,0.75),rgba(26,16,11,0.55))]
                hover:border-[rgba(255,174,45,0.25)]
                hover:shadow-[0_14px_42px_rgba(0,0,0,0.6),0_0_18px_rgba(255,180,60,0.22)]
                transition
              "
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#ffc04a]">
                {category.title}
              </h2>

              <ul className="space-y-3 sm:space-y-4">
                {category.rules.map((rule: string, ruleIndex: number) => (
                  <li key={ruleIndex} className="flex items-start gap-3">
                    <span className="mt-1 shrink-0 text-[#ffae2d]">•</span>
                    <span className="text-sm sm:text-base text-[#d9cdc2]">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-12 sm:mt-16 text-center">
          <div
            className="
              p-6 sm:p-8 max-w-4xl mx-auto rounded-[22px] backdrop-blur-sm
              border border-[rgba(255,166,66,0.12)]
              shadow-[0_8px_28px_rgba(0,0,0,0.55)]
              bg-[linear-gradient(180deg,rgba(26,16,11,0.75),rgba(26,16,11,0.55))]
            "
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#ffc04a]">
              {rulesConfig.notice.title}
            </h3>
            <p className="text-base sm:text-lg text-[#d9cdc2]">
              {rulesConfig.notice.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
