import React from "react";
import Link from "next/link";
import { Compass, MessageCircle, Database } from "lucide-react";

export const Nav: React.FC = () => {
  return (
    <header className="sticky top-0 w-full z-40 bg-surface-container-lowest/90 backdrop-blur-md border-b border-stroke-soft shadow-sm">
      <div className="h-20 max-w-[1280px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-sky-blue rounded-xl p-1">
          <img
            src="/images/logo.png"
            alt="Greedy Adventures Logo"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="h-7 w-[1px] bg-stroke-soft hidden sm:block" />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-deep-navy tracking-tight leading-none">
              Sea View Skydiving
            </span>
            <span className="text-[10px] font-bold uppercase text-sky-blue tracking-wider mt-1">
              Pattaya Dropzone
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-surface-container-low rounded-full border border-stroke-soft"
        >
          <a
            href="#experience"
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-deep-navy hover:bg-surface-container transition-colors"
          >
            Experience
          </a>
          <a
            href="#packages"
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-deep-navy hover:bg-surface-container transition-colors"
          >
            Packages
          </a>
          <a
            href="#plan"
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-deep-navy hover:bg-surface-container transition-colors"
          >
            The Plan
          </a>
          <a
            href="#faq"
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-deep-navy hover:bg-surface-container transition-colors"
          >
            FAQ
          </a>
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-sky-blue hover:text-primary hover:bg-surface-container transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Knowledge View</span>
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/919535768554"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sunrise-orange hover:bg-sunrise-orange/95 text-pure-white text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Crew</span>
          </a>
          <Link
            href="/knowledge"
            className="md:hidden p-2.5 rounded-full bg-surface-container-low text-sky-blue hover:bg-surface-container border border-stroke-soft"
            title="Knowledge Base"
            aria-label="View Knowledge Base"
          >
            <Database className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};

