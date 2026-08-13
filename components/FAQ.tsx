import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none"
      >
        <span className="font-bold text-gray-900 text-sm sm:text-base">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
        )}
      </button>
      {isOpen && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed font-medium">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      question: "What is the difference between GPA and CGPA?",
      answer: "GPA (Grade Point Average) measures your academic achievement for a single semester, while CGPA (Cumulative Grade Point Average) calculates your overall performance across all semesters accumulated to date."
    },
    {
      question: "How is CGPA calculated?",
      answer: "CGPA is calculated by multiplying the Grade Point of each course by its Credit Units to get Quality Points (QP). We sum the QP of all courses across all semesters and divide it by the total Credit Units completed."
    },
    {
      question: "What is the 'Target CGPA Planner' or 'Reverse Math'?",
      answer: "It is an advanced academic planner. By entering your desired final CGPA and the number of credit units you have left to take, the calculator works backwards to show you the exact average GPA you must maintain in your remaining semesters."
    },
    {
      question: "Are my calculations and course inputs saved?",
      answer: "Yes! Everything is saved locally in your browser cache (LocalStorage). As long as you use the same browser, your courses and configurations will load exactly where you left off when you return."
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-12">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-black text-white rounded-lg">
          <HelpCircle className="h-4 w-4" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
      </div>

      <div className="divide-y divide-gray-50">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}
