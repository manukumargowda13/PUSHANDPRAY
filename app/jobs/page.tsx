"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Search,
  MapPin,
  Calendar,
  Building,
  ExternalLink,
  Sparkles,
  Clock,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useUserRole } from "@/lib/role-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { getGreenJobs, JobListing, JobsDataset } from "@/lib/data-service";

export default function JobsPage() {
  const { roleConfig } = useUserRole();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataset, setDataset] = useState<JobsDataset | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGreenJobs();
      setDataset(data);
    } catch (err: any) {
      console.error("[Jobs] Failed to load green jobs:", err);
      setError("Unable to load public job listings. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadJobs();
  }, []);

  const categories = [
    "All",
    "Solar Installation",
    "Wind Maintenance",
    "Battery Design",
    "Organic Farming",
    "Sustainability",
  ];

  // Distinct locations for dropdown
  const locations = useMemo(() => {
    if (!dataset) return ["All"];
    const locSet = new Set<string>();
    dataset.jobs.forEach((j) => {
      const parts = j.location.split(",");
      const region = parts.length > 1 ? parts[1].trim() : parts[0].trim();
      locSet.add(region);
    });
    return ["All", ...Array.from(locSet).sort()];
  }, [dataset]);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    if (!dataset) return [];
    return dataset.jobs.filter((j) => {
      const matchCategory = category === "All" || j.category === category;
      const matchType = jobType === "All" || j.type === jobType;
      const matchLocation = location === "All" || j.location.includes(location);
      const matchSearch =
        search === "" ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.description.toLowerCase().includes(search.toLowerCase()) ||
        j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      return matchCategory && matchType && matchLocation && matchSearch;
    });
  }, [dataset, category, jobType, location, search]);

  if (!mounted || loading) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-teal-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-navy-700 font-semibold">
          Loading green workforce listings...
        </p>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4 rounded-2xl border border-ivory-300 bg-white p-8 shadow-warm">
        <div className="w-12 h-12 rounded-full bg-saffron-50 text-saffron-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-navy-950">
          Jobs Board Temporarily Unavailable
        </h3>
        <p className="text-xs text-navy-700 leading-relaxed">
          {error || "Unable to read clean workforce registry."}
        </p>
        <button
          type="button"
          onClick={loadJobs}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading Listings</span>
        </button>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    "Solar Installation": "bg-saffron-50 text-saffron-850 border-saffron-200",
    "Wind Maintenance": "bg-teal-50 text-teal-850 border-teal-200",
    "Battery Design": "bg-navy-50 text-navy-850 border-navy-200",
    "Organic Farming": "bg-naturalGreen-50 text-naturalGreen-850 border-naturalGreen-200",
    "Sustainability": "bg-teal-50/60 text-navy-900 border-teal-300",
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-naturalGreen-50 text-naturalGreen-800 px-2.5 py-0.5 rounded border border-naturalGreen-200">
              Module D4
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Green Jobs & Clean Workforce Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-navy-700 mt-1 max-w-3xl">
            Connecting clean tech talent with opportunities in solar installation, wind turbine O&M, battery management, agro-photovoltaics, and corporate ESG reporting.
          </p>
        </div>

        <DataFreshnessBadge
          source={dataset.source}
          lastUpdated={dataset.last_updated}
          isSampleData={true}
        />
      </div>

      {/* Role Context Callout */}
      <div className="rounded-2xl border border-ivory-300 bg-white p-4 text-xs text-navy-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-warm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
            <Sparkles className="w-4 h-4 text-teal-700 flex-shrink-0" />
          </div>
          <span className="text-navy-800">
            <strong>Role Focus ({roleConfig.badge}):</strong> Showing listings aligned with {roleConfig.focusArea}. Use search to filter by specialization or technology stack.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 whitespace-nowrap self-start sm:self-center">
          {filteredJobs.length} of {dataset.total_count} Listings Available
        </span>
      </div>

      {/* Search Bar & Multi-Category Filter Bar */}
      <div className="space-y-4">
        {/* Search input + Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by role, company, skill (e.g. PVSyst, BMS, AutoCAD, BRSR)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-ivory-300 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs text-navy-950 font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-ivory-300 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs font-medium"
            >
              <option value="All">All Regions / States</option>
              {locations.filter((l) => l !== "All").map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-ivory-300 bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs font-medium"
            >
              <option value="All">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Contract">Contract / Project-Based</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-navy-900 text-ivory border-navy-900 shadow-2xs"
                    : "bg-white text-navy-800 border-ivory-300 hover:bg-ivory-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Grid */}
      <ErrorBoundary fallbackTitle="Listings Display Error">
        {filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ivory-300 p-12 text-center space-y-3 bg-white">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-navy-950">No matching green jobs found</h3>
            <p className="text-xs text-navy-700 max-w-sm mx-auto">
              Try loosening your search terms or clearing region and category filters to view all {dataset.total_count} opportunities.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setLocation("All");
                setJobType("All");
              }}
              className="text-xs font-bold text-teal-800 hover:underline pt-2 inline-block"
            >
              {t("resetFilters", "Reset All Filters")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job: JobListing) => {
              // Placeholder data labelled as sample data in code comment and UI tag
              const catBadgeClass =
                categoryColors[job.category] || "bg-ivory-100 text-navy-800 border-ivory-200";

              return (
                <div
                  key={job.id}
                  className="rounded-2xl border border-ivory-300 bg-white p-5 shadow-warm hover:shadow-lifted hover:border-teal-400 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Bar: Category Pill & Sample Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catBadgeClass}`}
                      >
                        {job.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-ivory-100 px-2 py-0.5 rounded border border-ivory-200">
                        sample data
                      </span>
                    </div>

                    {/* Title & Company */}
                    <div>
                      <h3 className="text-base font-bold text-navy-950 tracking-tight leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold text-navy-700 mt-0.5 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-teal-700" />
                        <span>{job.company}</span>
                      </p>
                    </div>

                    {/* Metadata Row: Location, Type, Experience */}
                    <div className="flex flex-wrap gap-y-1.5 gap-x-3 text-xs text-slate-500 pt-1 border-t border-ivory-200">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.type}</span>
                      </span>
                      {job.experience && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.experience}</span>
                        </span>
                      )}
                    </div>

                    {/* Salary if present */}
                    {job.salary_range && (
                      <div className="text-xs font-mono font-bold text-teal-900 bg-teal-50 px-2 py-1 rounded-md border border-teal-200 inline-block">
                        {job.salary_range} / year
                      </div>
                    )}

                    {/* Description snippet */}
                    <p className="text-xs text-navy-700 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-ivory-100 text-navy-800 px-2 py-0.5 rounded-md font-semibold border border-ivory-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-[10px] text-slate-500 font-mono self-center">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Apply Button */}
                  <div className="pt-4 mt-4 border-t border-ivory-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{job.posted_date || "Recent"}</span>
                    </span>

                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 shadow-2xs transition-colors"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3 text-teal-700" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}
