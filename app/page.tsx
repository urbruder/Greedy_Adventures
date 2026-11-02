"use client";

import React, { useState } from "react";
import { Nav } from "@/components/ui/Nav";
import { Hero } from "@/components/ui/Hero";
import { Packages } from "@/components/ui/Packages";
import { PlanSteps } from "@/components/ui/PlanSteps";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Footer } from "@/components/ui/Footer";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function HomePage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Sticky Top Navigation */}
      <Nav />

      {/* Main Page Sections */}
      <main className="flex-1">
        <Hero onOpenChat={() => setChatOpen(true)} />
        <Packages />
        <PlanSteps />
        <FaqAccordion />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Chatbot Assistant */}
      <ChatPanel initialOpen={chatOpen} />
    </div>
  );
}

