"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faSearch } from "@fortawesome/free-solid-svg-icons";
import faqConfig from "@/config/faq.json";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredCategories = faqConfig.categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f0b] via-[#2b0f05] to-[#0a0402] py-16 sm:py-20 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffae2d] drop-shadow-[0_0_12px_rgba(255,174,45,0.4)] mb-6">
            {faqConfig.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {faqConfig.description}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <FontAwesomeIcon
              icon={faSearch as any}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <Input
              placeholder="Search for a question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1f120a]/60 border-[#ffae2d]/30 text-white placeholder-gray-400 backdrop-blur-sm focus:border-[#ffae2d] focus:ring-1 focus:ring-[#ffae2d] transition-all"
            />
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10 sm:space-y-12">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#ffae2d] mb-6 sm:mb-8 flex items-center">
                <span className="mr-2 text-3xl">🔥</span>
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const globalIndex = categoryIndex * 100 + index;
                  const isOpen = openItems.includes(globalIndex);

                  return (
                    <Card
                      key={index}
                      className="bg-[#2b1608]/70 border border-[#ffae2d]/20 overflow-hidden transition-all duration-300 hover:border-[#ffae2d]/40 hover:shadow-lg hover:shadow-[rgba(255,174,45,0.25)] backdrop-blur-sm"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full p-4 sm:p-6 text-left flex items-center justify-between group"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-white pr-4 group-hover:text-[#ffd27a] transition-colors">
                          {faq.question}
                        </h3>
                        {isOpen ? (
                          <FontAwesomeIcon
                            icon={faChevronUp as any}
                            className="w-5 h-5 text-[#ffae2d] flex-shrink-0 group-hover:text-[#ffd27a] transition-colors"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faChevronDown as any}
                            className="w-5 h-5 text-[#ffae2d] flex-shrink-0 group-hover:text-[#ffd27a] transition-colors"
                          />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-[#ffae2d]/10">
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredCategories.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-base sm:text-lg">
              No questions found matching “{searchTerm}”
            </p>
          </div>
        )}

        {/* Footer section */}
        <div className="mt-16 text-center">
          <div className="bg-[#2b1608]/70 border border-[#ffae2d]/30 rounded-lg p-6 sm:p-8 backdrop-blur-sm hover:shadow-[0_0_18px_rgba(255,174,45,0.25)] transition-all">
            <h3 className="text-xl sm:text-2xl font-bold text-[#ffae2d] mb-4">
              {faqConfig.stillHaveQuestions.title}
            </h3>
            <p className="text-base sm:text-lg text-gray-300">
              {faqConfig.stillHaveQuestions.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
