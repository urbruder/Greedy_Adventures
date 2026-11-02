import React from "react";
import Link from "next/link";
import { Compass, MessageCircle, Database, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-deep-navy text-pure-white border-t border-stroke-soft/20 py-12 md:py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Disclaimer */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Greedy Adventures Logo"
                className="h-10 w-auto bg-white/95 px-3 py-1.5 rounded-xl object-contain shadow-xs"
              />
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-pure-white leading-none">
                  Sea View Skydiving
                </span>
                <span className="text-[10px] font-bold uppercase text-sky-blue tracking-wider mt-1">
                  Pattaya Dropzone
                </span>
              </div>
            </div>

            <p className="text-xs text-pure-white/70 max-w-md leading-relaxed">
              Tandem skydiving above the Gulf of Thailand in Pattaya. 13,000 feet exit altitude, 120 mph coastal freefall, and USPA-certified instructors. Operated by Dropzone Thailand.
            </p>

            {/* Mandatory Demo Disclaimer */}
            <div className="p-3.5 rounded-xl bg-pure-white/10 border border-pure-white/15 max-w-md">
              <span className="text-[11px] font-bold text-sunrise-orange uppercase tracking-wider block">
                Prototype Notice
              </span>
              <p className="text-xs text-pure-white/80 mt-1 leading-relaxed">
                Demo prototype, not the official site. Built for the Greedy Adventures Full Stack Developer Assignment (Round 1). Content extracted from public website sources.
              </p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-blue">
              Exploration
            </h4>
            <ul className="text-xs space-y-2 text-pure-white/80">
              <li>
                <a href="#experience" className="hover:text-pure-white transition-colors">
                  Experience Highlights
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-pure-white transition-colors">
                  Thailand Packages (ECO, DELUXE, VIP)
                </a>
              </li>
              <li>
                <a href="#plan" className="hover:text-pure-white transition-colors">
                  The Jump Plan
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-pure-white transition-colors">
                  Dropzone FAQ
                </a>
              </li>
              <li>
                <Link
                  href="/knowledge"
                  className="inline-flex items-center gap-1 text-sky-blue hover:text-pure-white font-bold transition-colors"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Knowledge View</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Dropzone Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-blue">
              Contact & Booking
            </h4>
            <div className="text-xs space-y-2 text-pure-white/80 leading-relaxed">
              <p>
                <strong className="text-pure-white block">WhatsApp (Fastest):</strong>
                Usually replies within the hour
              </p>
              <a
                href="https://wa.me/919535768554"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sunrise-orange hover:underline font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>+91 95357 68554</span>
              </a>
              <p className="pt-2">
                <strong className="text-pure-white block">Location:</strong>
                95 M.4, Chakphong, Klaeng District, Rayong 21190, Thailand
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-pure-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-pure-white/60">
          <span>
            © {new Date().getFullYear()} Sea View Skydiving Prototype. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://www.greedyadventures.com/cancellations"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pure-white transition-colors"
            >
              Cancellations
            </a>
            <a
              href="https://www.greedyadventures.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pure-white transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href="https://www.greedyadventures.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pure-white transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

