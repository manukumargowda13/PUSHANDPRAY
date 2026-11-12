"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "citizen" | "industry" | "policymaker" | "financier";

export interface RoleConfig {
  id: UserRole;
  label: string;
  badge: string;
  description: string;
  primaryAction: string;
  focusArea: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  citizen: {
    id: "citizen",
    label: "Citizen / Homeowner",
    badge: "Citizen",
    description: "Explore rooftop solar savings, PM Surya Ghar subsidy payback, and green career listings.",
    primaryAction: "Calculate Solar Savings",
    focusArea: "Household Net-Metering & Solar ROI",
  },
  industry: {
    id: "industry",
    label: "DISCOM / Industry Obligated Entity",
    badge: "DISCOM & Industry",
    description: "Audit Renewable Consumption Obligation (RCO) compliance, compute shortfall kWh, and plan procurement.",
    primaryAction: "Track RPO/RCO Compliance",
    focusArea: "Statutory RCO Mandates & Clean PPA",
  },
  policymaker: {
    id: "policymaker",
    label: "Policymaker / Grid Regulator",
    badge: "Policymaker",
    description: "Monitor thermal coal vs renewable generation gaps, CEA capacity benchmarks, and regional grid transition.",
    primaryAction: "Inspect National Energy Mix",
    focusArea: "Capacity vs Generation Gap Analysis",
  },
  financier: {
    id: "financier",
    label: "Financier / Climate Fund",
    badge: "Financier",
    description: "Assess green asset yields, capital expenditure subsidy pipelines, and renewable employment metrics.",
    primaryAction: "Review Green Project Returns",
    focusArea: "Clean Tech Capex & Payback Analysis",
  },
};

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  roleConfig: RoleConfig;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("citizen");

  // Load from localStorage if present on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem("igg_active_role") as UserRole | null;
      if (saved && ROLE_CONFIGS[saved]) {
        setRoleState(saved);
      }
    } catch {
      // Ignore local storage error
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("igg_active_role", newRole);
    } catch {
      // Ignore local storage error
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        roleConfig: ROLE_CONFIGS[role],
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within a RoleProvider");
  }
  return context;
}
