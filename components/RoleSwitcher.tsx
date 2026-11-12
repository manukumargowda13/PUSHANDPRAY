"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUserRole, ROLE_CONFIGS, UserRole } from "@/lib/role-context";
import { Users, ChevronDown, Check, Sparkles } from "lucide-react";

export function RoleSwitcher({ className = "" }: { className?: string }) {
  const { role, setRole, roleConfig } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles = Object.keys(ROLE_CONFIGS) as UserRole[];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Users className="w-3.5 h-3.5 text-emerald-600" />
        <span className="font-semibold text-emerald-950">Role:</span>
        <span className="font-bold text-slate-900">{roleConfig.badge}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Stakeholder Lens
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalizes metrics, insights, and recommendations across modules.
            </p>
          </div>

          <div className="space-y-1">
            {roles.map((r) => {
              const item = ROLE_CONFIGS[r];
              const isSelected = r === role;

              return (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left rounded-lg p-2.5 transition-all text-xs flex items-start justify-between gap-2 ${
                    isSelected
                      ? "bg-emerald-50/80 text-emerald-950 border border-emerald-200"
                      : "text-slate-700 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">{item.label}</span>
                      {isSelected && (
                        <span className="inline-flex items-center text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {item.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{item.focusArea}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
