"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Search,
  MapPin,
  Calendar,
  Building,
  Filter,
  ExternalLink,
  Tag,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Clock,
} from "lucide-react";
import { DataFreshnessBadge } from "@/components/DataFreshnessBadge";
import { useUserRole } from "@/lib/role-context";
import { getGreenJobs, JobListing, JobsDataset } from "@/lib/data-service";

export default function JobsPage() {
  const { roleConfig } = useUserRole();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState<JobsDataset | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");

  useEffect(() => {
    setMounted(true);
    async function loadJobs() {
      try {
        const data = await getGreenJobs();
        setDataset(data);
      } catch (err) {
        console.error("Failed to load green jobs:", err);
      } finally {
        setLoading(false);
      }
    }
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

  if (!mounted || loading || !dataset) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">
          Loading green workforce listings...
        </p>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    "Solar Installation": "bg-amber-100 text-amber-900 border-amber-200",
    "Wind Maintenance": "bg-emerald-100 text-emerald-900 border-emerald-200",
    "Battery Design": "bg-sky-100 text-sky-900 border-sky-200",
    "Organic Farming": "bg-teal-100 text-teal-900 border-teal-200",
    "Sustainability": "bg-purple-100 text-purple-900 border-purple-200",
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
              Module D4
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Green Jobs & Clean Workforce Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
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
      <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4 text-xs text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span>
            <strong>Role Focus ({roleConfig.badge}):</strong> Showing listings aligned with {roleConfig.focusArea}. Use search to filter by specialization or technology stack.
          </span>
        </div>
        <span className="text-[11px] font-mono text-purple-800 bg-white px-2 py-0.5 rounded border border-purple-200 whitespace-nowrap self-start sm:self-center">
          {filteredJobs.length} of {dataset.total_count} Listings Shown
        </span>
      </div>

      {/* Search Bar & Multi-Category Filter Bar */}
      <div className="space-y-4">
        {/* Search input + Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by role, company, skill (e.g. PVSyst, BMS, AutoCAD, BRSR)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
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
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
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
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Grid */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3 bg-white">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching green jobs found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
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
            className="text-xs font-semibold text-purple-700 hover:underline pt-2 inline-block"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job: JobListing) => {
            // Note: Placeholder data labelled as sample data in code comment and UI tag
            const catBadgeClass =
              categoryColors[job.category] || "bg-slate-100 text-slate-800 border-slate-200";

            return (
              <div
                key={job.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category Pill & Sample Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catBadgeClass}`}
                    >
                      {job.category}
                    </span>
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      sample data
                    </span>
                  </div>

                  {/* Title & Company */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.company}</span>
                    </p>
                  </div>

                  {/* Metadata Row: Location, Type, Experience */}
                  <div className="flex flex-wrap gap-y-1.5 gap-x-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
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
                    <div className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50/80 px-2 py-1 rounded inline-block">
                      {job.salary_range} / year
                    </div>
                  )}

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-mono self-center">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Apply Button */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{job.posted_date || "Recent"}</span>
                  </span>

                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
