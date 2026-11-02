import React from "react";
import { HelpCircle, MessageCircle } from "lucide-react";

interface NotAvailableMessageProps {
  message?: string;
}

export const NotAvailableMessage: React.FC<NotAvailableMessageProps> = ({
  message = "I couldn't find that specific information on our website. You can contact our flight desk directly on WhatsApp at +91 95357 68554.",
}) => {
  return (
    <div className="p-3.5 bg-surface-container-low text-on-surface rounded-2xl rounded-tl-sm shadow-sm border border-stroke-soft space-y-2">
      <div className="flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5 text-sunrise-orange" />
        <p className="text-xs text-deep-navy leading-relaxed font-medium">
          {message}
        </p>
      </div>

      <div className="pt-1 flex items-center justify-between">
        <span className="text-[11px] text-tertiary">Direct Dropzone WhatsApp</span>
        <a
          href="https://wa.me/919535768554"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <MessageCircle className="w-3 h-3" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

