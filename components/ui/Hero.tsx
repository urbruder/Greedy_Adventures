import React from "react";
import { Compass, ShieldCheck, Wind, Gauge, Sparkles, MessageSquare } from "lucide-react";

interface HeroProps {
  onOpenChat?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenChat }) => {
  return (
    <section
      id="experience"
      className="relative w-full overflow-hidden bg-deep-navy text-pure-white py-16 md:py-24"
    >
      {/* Stitch Ambient Coastal Aerial Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 scale-105 transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDM0AkGD1gNZx_d1tppqWYlVJj8it3zZ5BwtQ85ExKUviVu5pKyHrfptYcTXwQc4IdrluoBCdUnhRFhARkoe9N7fjvzqH15e8GVAlP_EyFKtXytwVlYszeLACMpXKc-0I-H32KtboUAaih9NuMc_w4ZHHRcHhQh47wK5Ln5BKRDHTwDebXIKmFa2a_TTJGcrSh_w5VWOYQpbMmqSwU6yluS2_wALy0hw79sCb6DyK-x')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/95 via-deep-navy/85 to-deep-navy/55 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sunrise-orange/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl space-y-6">
          {/* Active Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-pure-white/10 backdrop-blur-md border border-pure-white/15">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-pure-white">
              Pattaya Flight Zone • 13,000 FT AGL • Open Daily
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-pure-white">
            Defy Gravity Above the Gulf of Thailand.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-pure-white/80 max-w-2xl leading-relaxed">
            Experience an unforgettable 120 mph coastal freefall from 13,000 feet.
            USPA-certified tandem masters, turbine climbs, and panoramic ocean vistas.
            Operated by Dropzone Thailand with flights 365 days a year.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a
              href="#packages"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-sunrise-orange hover:bg-sunrise-orange/90 text-pure-white text-sm font-bold shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-sunrise-orange/40"
            >
              Explore Packages
            </a>
            {onOpenChat && (
              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-pure-white/15 hover:bg-pure-white/25 backdrop-blur-md text-pure-white text-sm font-bold transition-all border border-pure-white/20 focus:outline-none focus:ring-4 focus:ring-pure-white/20"
              >
                <Sparkles className="w-4 h-4 text-sunrise-orange" />
                <span>Ask AI Assistant</span>
              </button>
            )}
            <a
              href="https://wa.me/919535768554"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 backdrop-blur-md text-pure-white text-sm font-semibold transition-all border border-pure-white/15"
            >
              <span>WhatsApp Inquiries</span>
            </a>
          </div>

          {/* Live Flight Conditions Capsule */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            <div className="p-3.5 rounded-2xl bg-pure-white/5 backdrop-blur-md border border-pure-white/10">
              <span className="text-[10px] uppercase font-bold text-sky-blue tracking-wider block">
                Exit Altitude
              </span>
              <span className="text-lg font-bold text-pure-white mt-0.5 block">
                13,000 FT
              </span>
              <span className="text-[11px] text-pure-white/60">60s freefall</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-pure-white/5 backdrop-blur-md border border-pure-white/10">
              <span className="text-[10px] uppercase font-bold text-sky-blue tracking-wider block">
                Dropzone
              </span>
              <span className="text-lg font-bold text-pure-white mt-0.5 block">
                Pattaya
              </span>
              <span className="text-[11px] text-pure-white/60">Gulf of Thailand</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-pure-white/5 backdrop-blur-md border border-pure-white/10">
              <span className="text-[10px] uppercase font-bold text-sky-blue tracking-wider block">
                Safety Rigging
              </span>
              <span className="text-lg font-bold text-pure-white mt-0.5 block">
                Dual AAD
              </span>
              <span className="text-[11px] text-pure-white/60">USPA Certified</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-pure-white/5 backdrop-blur-md border border-pure-white/10">
              <span className="text-[10px] uppercase font-bold text-sky-blue tracking-wider block">
                Schedule
              </span>
              <span className="text-lg font-bold text-pure-white mt-0.5 block">
                365 Days
              </span>
              <span className="text-[11px] text-pure-white/60">Daily departures</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

