"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  source: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Do I need any experience to do a tandem jump?",
    answer:
      "None at all. On a tandem jump you are securely harnessed to a USPA-certified tandem instructor who handles the aircraft exit, freefall stability, canopy flight, and landing. You receive a comprehensive 20-minute ground briefing first, and that is all the preparation you need.",
    source: "https://www.greedyadventures.com/contact",
  },
  {
    question: "What are the age and weight limits?",
    answer:
      "You must be 18 years or older with valid government-issued photo ID or passport. The weight limit for tandem jumps is 100 kg, and weight must be proportional to height for safe harness fitting. If you are close to the limit, please message our team on WhatsApp beforehand.",
    source: "https://www.greedyadventures.com/contact",
  },
  {
    question: "Do I have to pay in advance?",
    answer:
      "No. Send us your preferred jump date on WhatsApp and we will hold your slot. You pay directly at the dropzone on the day of the jump. There is no credit card gateway required on our site.",
    source: "https://www.greedyadventures.com/contact",
  },
  {
    question: "What happens if the weather is bad?",
    answer:
      "Skydiving runs strictly on wind and cloud visibility safety limits. If a load is delayed or held for weather, you can wait for the next open window on the same day, reschedule to any other date at zero cost, or receive a full refund if a deposit was placed.",
    source: "https://www.greedyadventures.com/cancellations",
  },
  {
    question: "How long does the whole experience take?",
    answer:
      "We recommend budgeting three to four hours at the dropzone. That comfortably covers manifest registration, safety briefing, harness fitting, the turbine flight to 13,000 ft, the jump itself, and collecting your photos and video afterward.",
    source: "https://www.greedyadventures.com/contact",
  },
  {
    question: "Is Bangkok hotel pickup available?",
    answer:
      "Yes. Round-trip private transfer from Bangkok hotels directly to the Pattaya dropzone is available as a fixed-price add-on. Contact our crew on WhatsApp to coordinate pickup timing.",
    source: "https://www.greedyadventures.com/experiences/sea-view-skydiving",
  },
];

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-surface">
      <div className="max-w-[840px] mx-auto px-6 lg:px-12 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-blue block">
            Clear Answers
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-on-surface-variant">
            Verified directly from our dropzone operations and contact guidelines.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-pure-white border border-stroke-soft overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-sky-blue"
                >
                  <span className="font-bold text-sm md:text-base text-deep-navy">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-tertiary shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-sky-blue" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 space-y-3 text-xs md:text-sm text-on-surface-variant leading-relaxed border-t border-stroke-soft/60 animate-fadeIn">
                    <p>{faq.answer}</p>
                    <div className="pt-1">
                      <span className="text-[11px] text-tertiary">
                        Verified ground truth from{" "}
                        <a
                          href={faq.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-blue hover:underline font-semibold"
                        >
                          greedyadventures.com
                        </a>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

