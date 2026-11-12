import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "India Green Grid | Energy Intelligence Platform",
  description:
    "Role-based public energy intelligence platform turning fragmented CEA, NPP, and Grid-India data into actionable insights for citizens, DISCOMs, policymakers, and financiers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 flex flex-col`}>
        <RoleProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                © 2026 <strong>India Green Grid</strong> — CodeSpark 2026 Hackathon Demo.
              </p>
              <div className="flex items-center gap-4 text-slate-500">
                <span>Data Sources: CEA, NPP, Grid-India, MNRE</span>
                <span>•</span>
                <span className="font-semibold text-emerald-700">12-Hour MVP</span>
              </div>
            </div>
          </footer>
        </RoleProvider>
      </body>
    </html>
  );
}
