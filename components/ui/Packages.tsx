import React from "react";
import { Check, Star, Video, Camera, Sparkles, MessageCircle } from "lucide-react";

interface PackagesProps {
  onSelectPackage?: (pkgName: string) => void;
}

export const Packages: React.FC<PackagesProps> = ({ onSelectPackage }) => {
  return (
    <section id="packages" className="w-full py-16 md:py-24 bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stroke-soft pb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-blue block mb-2">
              Thailand Flight Packages
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy tracking-tight">
              Curated Coastal Jump Profiles
            </h2>
          </div>
          <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
            Same aircraft, same 13,000 ft altitude, and same USPA-certified instructors in every package.
            Choose the media coverage that suits you.
          </p>
        </div>

        {/* 3 Real Thailand Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: ECO */}
          <div className="rounded-3xl bg-pure-white p-7 shadow-elevated border border-stroke-soft flex flex-col justify-between hover:shadow-card transition-all">
            <div className="space-y-4">
              {/* Stitch Photography Window */}
              <div className="h-44 w-full rounded-2xl overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqkmi7WqJ3ReQBzTC74MQWeaAh9aavuj-L3F0GlBSr-GlSehBHgnN_Fu3ltDjy-iY9_3rVP82INGBBH0ByMUcUtb56jvjsyPZ5-PuODBcPVAUH8opE9QrPlrma2TRvq6Af8NHIH4ZsUNIobRa5JpkThHQcTJLWQXnWeiY3bn7p95_7v9p91Gbv9yfgcdN44qq-Iz-4jTQaBxCfGFDVJ-7tyhV--YVg9CkjKtXaF9Zk')`,
                  }}
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-deep-navy/90 backdrop-blur-md text-pure-white text-[10px] uppercase font-bold tracking-wider">
                  13,000 FT
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-deep-navy/10 text-deep-navy text-xs font-bold uppercase tracking-wider">
                  Tandem Jump
                </span>
                <span className="text-xs text-tertiary font-semibold">Standard Jump</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-deep-navy">ECO Package</h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  The pure freefall experience. The jump, nothing else. Perfect for thrill-seekers focused entirely on the leap.
                </p>
              </div>

              <div className="pt-2 border-t border-stroke-soft">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-deep-navy">฿9,500</span>
                  <span className="text-xs text-tertiary font-medium">/ person</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                  Pay at dropzone on jump day
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-deep-navy block uppercase tracking-wider">
                  Included:
                </span>
                <ul className="text-xs space-y-2 text-on-surface">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Tandem skydive in Pattaya, Thailand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Safety briefing & custom harness fitting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Turbine aircraft ascent & ocean view</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Official certificate of completion</span>
                  </li>
                  <li className="flex items-start gap-2 text-outline">
                    <span className="w-4 h-4 text-center shrink-0">—</span>
                    <span>No photo or video recording included</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stroke-soft">
              <a
                href="https://wa.me/919535768554?text=Hi%2C%20I%20am%20interested%20in%20the%20ECO%20Package%20(฿9%2C500)%20for%20Sea%20View%20Skydiving"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-surface-container-low hover:bg-surface-container text-deep-navy text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-stroke-soft"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Reserve ECO Slot</span>
              </a>
            </div>
          </div>

          {/* Card 2: DELUXE (Featured) */}
          <div className="rounded-3xl bg-pure-white p-7 shadow-card border-2 border-sky-blue flex flex-col justify-between relative transform md:-translate-y-2">
            <span className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-sunrise-orange text-pure-white text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 z-10">
              <Star className="w-3 h-3 fill-current" />
              <span>Most Popular</span>
            </span>

            <div className="space-y-4">
              {/* Stitch Photography Window */}
              <div className="h-44 w-full rounded-2xl overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPRC2PqwDLo1zaEGLXZI464yo3lGLoE9lMpvmHE6bdcKU_7lK8iRMLx1ZJztRrRfMKIe2hHMGljsfcGsTf48gMFX3wVDvWMkTJScGcirfBAzD6tfNkJR7sIDrGL19csr16AGYsz0KF5l7XqOGvNK4EuUEFveZFmyXRLbH4h48PQINOtomPTpqQPCb_otGeAfMKPLZUUj-JcbZuls_88McSHfVYmUMbfqgUGXjB6gMb')`,
                  }}
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-sky-blue/90 backdrop-blur-md text-pure-white text-[10px] uppercase font-bold tracking-wider">
                  13,000 FT + Photos & Video
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-sky-blue/15 text-sky-blue text-xs font-bold uppercase tracking-wider">
                  Tandem + Media
                </span>
                <span className="text-xs text-sky-blue font-bold">Complete Memory</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-deep-navy">DELUXE Package</h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Video and photos included. Relive your jump with high-resolution digital photos and edited flight video captured by your instructor.
                </p>
              </div>

              <div className="pt-2 border-t border-stroke-soft">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-deep-navy">฿12,500</span>
                  <span className="text-xs text-tertiary font-medium">/ person</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                  Pay at dropzone on jump day
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-deep-navy block uppercase tracking-wider">
                  Included:
                </span>
                <ul className="text-xs space-y-2 text-on-surface">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Tandem skydive in Pattaya, Thailand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Safety briefing & custom harness fitting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Turbine aircraft ascent & ocean view</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Official certificate of completion</span>
                  </li>
                  <li className="flex items-start gap-2 font-semibold text-deep-navy">
                    <Video className="w-4 h-4 text-sky-blue shrink-0 mt-0.5" />
                    <span>Wrist-mount HD video & photos included</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stroke-soft">
              <a
                href="https://wa.me/919535768554?text=Hi%2C%20I%20am%20interested%20in%20the%20DELUXE%20Package%20(฿12%2C500)%20for%20Sea%20View%20Skydiving"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-sunrise-orange hover:brightness-105 text-pure-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Reserve DELUXE Slot</span>
              </a>
            </div>
          </div>

          {/* Card 3: VIP */}
          <div className="rounded-3xl bg-pure-white p-7 shadow-elevated border border-stroke-soft flex flex-col justify-between hover:shadow-card transition-all">
            <div className="space-y-4">
              {/* Stitch Photography Window */}
              <div className="h-44 w-full rounded-2xl overflow-hidden relative">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBOW4HHi1LsQAGJIE8IK9DuEDK-HEcm-Hs9bIZDWxr-vQez2dqbR8GnT0WRBoc2CzxE84ZDNTi239SeI9rCG0elMwbaqHudE5BXV59v96nqdgDFy9F3wNOzaVM2iT40OzyEtUh78vtE4o8IaXuKMDugz9ISwG1NjKTNIMmnAbro7k4h28SeK4rBifII9JF-MYQuDy1q6-cuolk06MUXFLcsAvs_2ihPY4CShCuvVyv-')`,
                  }}
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-deep-navy/90 backdrop-blur-md text-pure-white text-[10px] uppercase font-bold tracking-wider">
                  13,000 FT Dedicated Flyer
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-deep-navy text-pure-white text-xs font-bold uppercase tracking-wider">
                  Outside Cameraman
                </span>
                <span className="text-xs text-deep-navy font-bold">Cinematic</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-deep-navy">VIP Package</h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Personal cameraman and edited film. A dedicated aerial camera flyer flies beside you in freefall for wide cinematic angles.
                </p>
              </div>

              <div className="pt-2 border-t border-stroke-soft">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-deep-navy">฿14,000</span>
                  <span className="text-xs text-tertiary font-medium">/ person</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                  Pay at dropzone on jump day
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-deep-navy block uppercase tracking-wider">
                  Included:
                </span>
                <ul className="text-xs space-y-2 text-on-surface">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Tandem skydive in Pattaya, Thailand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Safety briefing & custom harness fitting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Turbine aircraft ascent & ocean view</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Official certificate of completion</span>
                  </li>
                  <li className="flex items-start gap-2 font-semibold text-deep-navy">
                    <Camera className="w-4 h-4 text-sunrise-orange shrink-0 mt-0.5" />
                    <span>Dedicated outside flyer & edited film</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stroke-soft">
              <a
                href="https://wa.me/919535768554?text=Hi%2C%20I%20am%20interested%20in%20the%20VIP%20Package%20(฿14%2C000)%20for%20Sea%20View%20Skydiving"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-deep-navy hover:bg-deep-navy/90 text-pure-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Reserve VIP Slot</span>
              </a>
            </div>
          </div>
        </div>

        {/* Dropzone Policies Callout Strip */}
        <div className="p-6 rounded-2xl bg-surface-container-low border border-stroke-soft grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-deep-navy uppercase">
              No Advance Payment
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Hold your slot on WhatsApp. You pay directly at the dropzone on the day of the jump.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-deep-navy uppercase">
              Bangkok Hotel Transfers
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Round-trip private pickup from Bangkok hotels is available as a fixed-price add-on.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-deep-navy uppercase">
              Multilingual Dropzone
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Our tandem instructors speak English, Hindi, and Thai. Daily departures 365 days a year.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

