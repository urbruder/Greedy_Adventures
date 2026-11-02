import React from "react";
import { UserCheck, Shield, Plane, CloudSnow, MapPin } from "lucide-react";

export const PlanSteps: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Arrival & Check-in",
      desc: "Sign in at the dropzone with your valid government photo ID or passport.",
      icon: UserCheck,
    },
    {
      num: "02",
      title: "Safety Briefing & Fitting",
      desc: "Meet your USPA instructor for a 20-minute safety walk-through and harness fitting.",
      icon: Shield,
    },
    {
      num: "03",
      title: "Boarding & The Climb",
      desc: "Board the aircraft for a scenic 15-minute flight ascending to 13,000 feet.",
      icon: Plane,
    },
    {
      num: "04",
      title: "Exit & Freefall",
      desc: "Exit over the Gulf of Thailand for up to 60 seconds of freefall at 120 mph.",
      icon: CloudSnow,
    },
    {
      num: "05",
      title: "Canopy & Landing",
      desc: "Fly 5 to 7 minutes under parachute along the coastline and touch down safely.",
      icon: MapPin,
    },
  ];

  return (
    <section id="plan" className="w-full py-16 bg-surface-container-lowest border-y border-stroke-soft">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-blue block">
            The Jump Day Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-deep-navy tracking-tight">
            The Plan: From Ground to Stratosphere
          </h2>
          <p className="text-sm text-on-surface-variant">
            Everything is structured for absolute safety and calm reassurance. Here is how your jump unfolds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-surface-container-low border border-stroke-soft flex flex-col justify-between hover:bg-surface-container transition-colors relative"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-sky-blue/80">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-pure-white text-deep-navy flex items-center justify-center shadow-xs border border-stroke-soft">
                      <Icon className="w-5 h-5 text-deep-navy" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-deep-navy leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

