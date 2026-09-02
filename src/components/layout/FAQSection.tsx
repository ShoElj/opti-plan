'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What exactly is 'Money Left'?",
    answer: "Money Left is the core philosophy of Opti-Plan. It represents your true safe-to-spend balance. We calculate it by taking your total income and subtracting all your upcoming bills, committed savings, and current spending. What remains is yours to spend worry-free."
  },
  {
    question: "Does Opti-Plan connect to my bank accounts?",
    answer: "No. Opti-Plan is a manual entry tracker designed to keep you intentionally engaged with your finances. By logging your activity via our Quick Add feature, you maintain complete privacy and a stronger psychological connection to your money habits."
  },
  {
    question: "Is Opti-Plan free to use?",
    answer: "Opti-Plan offers a generous free tier that covers basic tracking and planning. Premium features like advanced Smart Alerts and unlimited savings goals require a paid subscription."
  },
  {
    question: "How does bills tracking work?",
    answer: "You can add recurring or one-time bills to your calendar. Opti-Plan automatically deducts upcoming bills from your 'Money Left' so you never accidentally spend the money you need for rent or utilities."
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes. We use bank-level encryption to secure your data in transit and at rest. Because we don't connect to your bank or store any actual banking credentials, the risk of external financial compromise is completely mitigated."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 text-left">
      {faqs.map((faq, i) => (
        <div 
          key={i} 
          className="rounded-2xl border bg-card overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-muted/30 transition-colors"
            aria-expanded={openIndex === i}
          >
            <span className="font-bold pr-8">{faq.question}</span>
            <ChevronDown 
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`} 
            />
          </button>
          
          <div 
            className={`grid transition-all duration-200 ease-in-out ${
              openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed border-t border-border/20 pt-4">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
