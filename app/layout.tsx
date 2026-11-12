import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "India Green Grid | National Clean Energy Intelligence Platform",
  description:
    "Statutory decision-support platform turning public energy data from CEA, NPP, Grid-India, and MNRE into actionable insights for citizens, DISCOMs, industries, policymakers, and financiers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-ivory text-navy-950 flex flex-col selection:bg-teal-100 selection:text-teal-950`}
      >
        <LanguageProvider>
          <RoleProvider>
            {/* National Accent Ribbon (Tricolor Micro-bar) */}
            <div className="national-accent-bar" aria-hidden="true" />

            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>

            <footer className="border-t border-ivory-300 bg-white py-8 text-xs text-navy-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-ivory-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-navy-900 flex items-center justify-center text-ivory text-[10px] font-black">
                        IG
                      </div>
                      <span className="font-extrabold text-navy-950 text-sm tracking-tight">
                        India Green Grid
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                        Statutory Public Data
                      </span>
                    </div>
                    <p className="text-navy-700 text-xs mt-1 max-w-2xl">
                      Open national decision-support system aggregating generation, capacity, compliance, and rooftop solar economics across Indian states and union territories.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-navy-800">
                    <span className="inline-flex items-center gap-1.5 text-teal-800">
                      <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                      Live Statutory Feed Connected
                    </span>
                    <span>•</span>
                    <span>ISO / POSOCO Aligned</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
                  <p>
                    © 2026 <strong>India Green Grid</strong>. All rights reserved. Built with open statutory records from Central Electricity Authority (CEA), National Power Portal (NPP), Grid-India, and MNRE.
                  </p>
                  <div className="flex items-center gap-4">
                    <a href="/dashboard" className="hover:text-navy-900 hover:underline">
                      Energy Mix
                    </a>
                    <a href="/rpo" className="hover:text-navy-900 hover:underline">
                      RCO Tracker
                    </a>
                    <a href="/solar" className="hover:text-navy-900 hover:underline">
                      Solar Calculator
                    </a>
                    <a href="/jobs" className="hover:text-navy-900 hover:underline">
                      Green Jobs
                    </a>
                    <a href="/roadmap" className="hover:text-navy-900 hover:underline">
                      Expansion Roadmap
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </RoleProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
