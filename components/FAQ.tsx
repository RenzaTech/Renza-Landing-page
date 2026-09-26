'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ChevronDown } from 'lucide-react';
import AnimatedBackground from '@/components/animations/AnimatedBackground';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'What is RENZA?',
    answer:
      'RENZA is an on-demand household help platform where customers can book trained and verified helpers for everyday household tasks. Instead of hiring and managing a permanent maid, you can simply book a RENZA Helper for the time you actually need help.',
  },
  {
    question: 'How much does RENZA cost?',
    answer:
      "RENZA's starting price is ₹199 per hour. You are charged based on the duration of help you book, making it flexible and straightforward to manage.",
  },
  {
    question: 'Do I need to hire a permanent maid?',
    answer:
      'No. RENZA is designed for customers who need household help on demand — without the commitment of managing a permanent maid arrangement. Book only when you need it.',
  },
  {
    question: 'What household tasks can I request?',
    answer:
      'Customers can request supported services such as house cleaning, vessel washing, laundry assistance, kitchen cleaning, room cleaning, and other approved household tasks. RENZA will expand its service offerings over time.',
  },
  {
    question: 'Are RENZA Helpers verified?',
    answer:
      'Yes. RENZA handles the verification and onboarding process for helpers on the platform. This includes identity verification and screening before a helper is made available for bookings.',
  },
  {
    question: 'Can I choose how long I need help?',
    answer:
      'Yes. Customers can select the required duration while booking, subject to RENZA\'s available booking options. This lets you pay only for the time you actually need.',
  },
  {
    question: 'How does RENZA assign a helper?',
    answer:
      "RENZA uses the customer's booking information, service requirements, location and helper availability to coordinate the assignment. RENZA manages this process so you don't have to search for or manage help yourself.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      itemRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.07,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: itemRef.current,
          start: 'top 88%',
          once: true,
        },
      }
    );
  }, [index]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={itemRef}
      className="border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors duration-300"
      style={{ opacity: 0 }}
    >
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className="text-sm md:text-base font-semibold text-text-primary pr-4 group-hover:text-primary transition-colors duration-200">
          {question}
        </span>
        <div
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isOpen
              ? 'bg-primary border-primary'
              : 'bg-light-bg dark:bg-[#070F0F] border-border dark:border-[#1E2E2E] group-hover:border-primary/40'
          }`}
        >
          <ChevronDown
            size={14}
            className={`transition-all duration-300 ${
              isOpen ? 'rotate-180 text-white' : 'text-text-secondary'
            }`}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Answer */}
      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        ref={answerRef}
        style={{
          maxHeight: isOpen ? '300px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="px-6 pb-5">
          <div className="h-px bg-border dark:bg-[#1E2E2E] mb-4" />
          <p className="text-sm text-text-secondary leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, []);

  return (
    <section
      id="faq"
      className="relative overflow-hidden section-padding bg-white dark:bg-[#070F0F]"
      aria-labelledby="faq-heading"
    >
      <AnimatedBackground variant="light" />
      <div className="container-renza">
        {/* Heading */}
        <div ref={headingRef} style={{ opacity: 0 }}>
          <SectionHeading
            title="Frequently Asked Questions"
            highlight="Questions"
            titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            description="Everything you need to know about RENZA. Can't find your answer? Contact our support team."
          />
        </div>

        {/* FAQ Items */}
        <div className="mt-12 max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>

        {/* Contact support */}
        <div className="mt-10 text-center">
          <p className="text-sm text-text-secondary">
            Still have questions?{' '}
            <button className="text-primary font-semibold hover:underline cursor-pointer">
              Contact our support team →
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
