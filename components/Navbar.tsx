"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Menu,
  X,
  BarChart3,
  ShieldCheck,
  Sun,
  Briefcase,
  Compass,
  Globe,
  Check,
  ChevronDown,
  Eye,
  Type,
} from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";
import { useLanguage } from "@/lib/i18n/language-context";
import { LanguageCode } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const {
    lang,
    setLang,
    languages,
    t,
    isLargeText,
    isHighContrast,
    toggleLargeText,
    toggleHighContrast,
  } = useLanguage();

  const NAV_ITEMS = [
    { href: "/dashboard", labelKey: "navEnergyMix", fallback: "Energy Mix", icon: BarChart3, badge: "D1" },
    { href: "/rpo", labelKey: "navRpo", fallback: "RPO / RCO", icon: ShieldCheck, badge: "D2" },
    { href: "/solar", labelKey: "navSolar", fallback: "Solar ROI", icon: Sun, badge: "D3" },
    { href: "/jobs", labelKey: "navJobs", fallback: "Green Jobs", icon: Briefcase, badge: "D4" },
    { href: "/roadmap", labelKey: "navRoadmap", fallback: "Roadmap", icon: Compass, badge: "D5-D9" },
  ];

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangMeta = languages.find((l) => l.code === lang) || languages[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ivory-300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-warm">
      {/* Subtle National Tricolor Ribbon */}
      <div className="national-accent-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo & National Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-850 text-white shadow-md shadow-navy-950/20 group-hover:scale-102 transition-transform border border-navy-700">
              <Zap className="h-5 w-5 text-saffron-500 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-navy-950">
                  {t("platformTitle", "India Green Grid")}
                </span>
                <span className="hidden sm:inline-block rounded-md bg-ivory-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 border border-ivory-300">
                  National Observatory
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                {t("platformSubtitle", "National Public Energy Intelligence Platform")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-navy-850 text-white shadow-2xs font-bold"
                      : "text-navy-900 hover:bg-ivory-100 hover:text-navy-950"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-saffron-500" : "text-teal-700")} />
                  <span>{t(item.labelKey, item.fallback)}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1 py-0.2 rounded font-mono",
                      isActive ? "bg-navy-700 text-ivory-100" : "bg-ivory-100 text-slate-500"
                    )}
                  >
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Utility Bar: Accessibility, Language, Role & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Accessibility Toggles: Large Text & High Contrast */}
            <div className="hidden sm:flex items-center gap-1 border-r border-ivory-300 pr-2">
              <button
                type="button"
                onClick={toggleLargeText}
                className={cn(
                  "p-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-0.5",
                  isLargeText
                    ? "bg-teal-700 text-white border-teal-800"
                    : "bg-white text-navy-800 border-ivory-300 hover:bg-ivory-100"
                )}
                title={isLargeText ? "Reset Text Size" : "Enlarge Text Size"}
                aria-label="Toggle text size"
              >
                <Type className="w-3.5 h-3.5" />
                <span className="text-[10px]">{isLargeText ? "A+" : "A"}</span>
              </button>

              <button
                type="button"
                onClick={toggleHighContrast}
                className={cn(
                  "p-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-0.5",
                  isHighContrast
                    ? "bg-navy-950 text-white border-black"
                    : "bg-white text-navy-800 border-ivory-300 hover:bg-ivory-100"
                )}
                title={isHighContrast ? "Disable High Contrast" : "Enable High Contrast"}
                aria-label="Toggle high contrast"
              >
                <Eye className="w-3.5 h-3.5 text-saffron-600" />
              </button>
            </div>

            {/* 8-Language Selector Dropdown */}
            <div className="relative inline-block text-left" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-ivory-300 bg-white px-2.5 py-1.5 text-xs font-medium text-navy-900 shadow-2xs hover:bg-ivory-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Select language"
                aria-haspopup="true"
                aria-expanded={langMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-teal-700" />
                <span className="font-bold text-navy-950">{currentLangMeta.nativeLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-ivory-300 bg-white p-2 shadow-lifted">
                  <div className="px-2 py-1 border-b border-ivory-200 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select Language (भाषा)
                    </span>
                  </div>

                  <div className="space-y-0.5 max-h-64 overflow-y-auto">
                    {languages.map((l) => {
                      const isSelected = l.code === lang;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLang(l.code);
                            setLangMenuOpen(false);
                          }}
                          className={cn(
                            "w-full text-left rounded-lg px-2.5 py-1.5 text-xs flex items-center justify-between transition-colors",
                            isSelected
                              ? "bg-teal-50 text-teal-950 font-bold border border-teal-200"
                              : "text-slate-700 hover:bg-ivory-100"
                          )}
                        >
                          <div>
                            <span className="font-semibold text-slate-900">{l.nativeLabel}</span>
                            <span className="text-[11px] text-slate-500 ml-1.5">({l.label})</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-700" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Stakeholder Role Switcher */}
            <RoleSwitcher />

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-ivory-100 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-ivory-300 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lifted">
          <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-navy-850 text-white font-bold"
                    : "text-slate-700 hover:bg-ivory-100"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4 w-4", isActive ? "text-saffron-500" : "text-teal-700")} />
                  <span>{t(item.labelKey, item.fallback)}</span>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded font-mono",
                    isActive ? "bg-navy-700 text-ivory-100" : "bg-ivory-100 text-slate-600"
                  )}
                >
                  {item.badge}
                </span>
              </Link>
            );
          })}

          {/* Mobile Accessibility Controls */}
          <div className="pt-3 border-t border-ivory-200 flex items-center justify-between px-2 text-xs">
            <span className="font-semibold text-slate-600">Reading Options:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleLargeText}
                className="px-2.5 py-1 rounded bg-ivory-100 border border-ivory-300 font-bold text-navy-900"
              >
                {isLargeText ? "Normal Text" : "Larger Text"}
              </button>
              <button
                type="button"
                onClick={toggleHighContrast}
                className="px-2.5 py-1 rounded bg-ivory-100 border border-ivory-300 font-bold text-navy-900"
              >
                {isHighContrast ? "Standard Contrast" : "High Contrast"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
