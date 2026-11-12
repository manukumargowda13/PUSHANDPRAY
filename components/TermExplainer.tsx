"use client";

import React, { useState } from "react";
import { HelpCircle, X, Lightbulb, Compass, ArrowRight } from "lucide-react";
import { TECHNICAL_EXPLAINERS, TechnicalTermExplanation } from "@/lib/i18n/translations";
import { useLanguage } from "@/lib/i18n/language-context";

interface TermExplainerProps {
  termKey: keyof typeof TECHNICAL_EXPLAINERS | string;
  variant?: "badge" | "icon" | "inline";
  label?: string;
  className?: string;
}

export function TermExplainer({
  termKey,
  variant = "badge",
  label,
  className = "",
}: TermExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const data: TechnicalTermExplanation | undefined =
    TECHNICAL_EXPLAINERS[termKey as keyof typeof TECHNICAL_EXPLAINERS];

  if (!data) return null;

  return (
    <>
      {variant === "badge" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50/90 hover:bg-teal-100 px-2 py-0.5 rounded-full border border-teal-200 transition-colors ${className}`}
          title={`Click to learn: ${data.term}`}
          aria-haspopup="dialog"
        >
          <HelpCircle className="w-3 h-3 text-teal-700" />
          <span>{label || t("whatDoesThisMean", "What does this mean?")}</span>
        </button>
      )}

      {variant === "icon" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`text-slate-400 hover:text-teal-700 transition-colors p-0.5 rounded-full focus:outline-none focus:ring-1 focus:ring-teal-500 ${className}`}
          title={`Click to understand: ${data.term}`}
          aria-label={`Explain ${data.term}`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      )}

      {variant === "inline" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1 text-xs text-teal-800 font-semibold underline underline-offset-2 hover:text-teal-950 ${className}`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-saffron-600" />
          <span>{label || data.simpleTitle}</span>
        </button>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white border border-ivory-300 shadow-lifted p-6 space-y-4"
            role="dialog"
            aria-modal="true"
          >
            {/* National Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-saffron-600 via-ivory-100 to-naturalGreen-700" />

            <div className="flex items-start justify-between gap-3 pt-1 border-b border-ivory-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                  Public Energy Explainer
                </span>
                <h3 className="text-base font-extrabold text-navy-950 mt-1">
                  {data.term}
                </h3>
                <p className="text-xs font-semibold text-teal-800 mt-0.5">
                  "{data.simpleTitle}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-ivory-100 focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-navy-900">
              {/* Plain English description */}
              <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                <span className="block font-bold text-navy-950 text-[11px] uppercase tracking-wider mb-1">
                  In Plain Language:
                </span>
                <p className="text-slate-700">{data.simpleExplanation}</p>
              </div>

              {/* Real World Analogy */}
              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200">
                <span className="font-bold text-teal-950 text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-saffron-600" />
                  <span>Everyday Analogy:</span>
                </span>
                <p className="text-slate-700">{data.realWorldAnalogy}</p>
              </div>

              {/* Why It Matters */}
              <div className="p-3 rounded-xl bg-white border border-ivory-300">
                <span className="block font-bold text-naturalGreen-900 text-[11px] uppercase tracking-wider mb-1">
                  Why It Matters for India:
                </span>
                <p className="text-slate-700">{data.whyItMatters}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-850 hover:bg-navy-950 text-white shadow-2xs transition-colors"
              >
                Got It, Thank You
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
