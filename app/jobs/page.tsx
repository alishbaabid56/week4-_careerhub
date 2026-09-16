"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

type Job = {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: string;
  salary: string | null;
  requirements: string | null;
  deadline: string | null;
  status: string;
  categoryId: string | null;
  categoryName: string | null;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const jobTypes = [
  { value: "", label: "All job types" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
];

function formatJobType(type: string) {
  const labels: Record<string, string> = {
    full_time: "Full Time",
    part_time: "Part Time",
    internship: "Internship",
    contract: "Contract",
    remote: "Remote",
  };

  return labels[type] || type;
}

function formatDate(date: string | null) {
  if (!date) return "No deadline";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function truncateText(text: string, length = 150) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}...`;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  async function fetchJobs() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search) {
        params.set("q", search);
      }

      if (location) {
        params.set("location", location);
      }

      if (jobType) {
        params.set("jobType", jobType);
      }

      params.set("page", String(page));
      params.set("limit", "9");

      const response = await fetch(`/api/jobs?${params.toString()}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load jobs.");
      }

      setJobs(data.jobs || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Jobs page error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading jobs."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [search, location, jobType, page]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
    setLocation(locationInput.trim());
  }

  function clearFilters() {
    setSearchInput("");
    setLocationInput("");
    setSearch("");
    setLocation("");
    setJobType("");
    setPage(1);
  }

  const hasFilters = Boolean(search || location || jobType);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              <Sparkles size={15} />
              Explore career opportunities
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Find your next{" "}
              <span className="text-indigo-600">opportunity.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Discover jobs and internships from growing companies and take
              the next step in your career.
            </p>
          </motion.div>

          {/* Search */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/50"
          >
            <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_auto]">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white">
                <Search size={19} className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Job title, company or keyword"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white">
                <MapPin size={19} className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={locationInput}
                  onChange={(event) => setLocationInput(event.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Search size={17} />
                Search Jobs
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Jobs */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Opportunities
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Latest jobs
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {pagination
                ? `${pagination.total} ${
                    pagination.total === 1 ? "opportunity" : "opportunities"
                  } available`
                : "Explore available opportunities"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <SlidersHorizontal size={16} />
              Filter:
            </div>

            <select
              value={jobType}
              onChange={(event) => {
                setJobType(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            >
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600"
              >
                <X size={15} />
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-11 w-11 rounded-xl bg-slate-200" />
                <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                <div className="mt-6 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="mt-8 h-10 w-full rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BriefcaseBusiness size={28} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No jobs found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {hasFilters
                ? "Try changing your search or filters to find more opportunities."
                : "There are no approved jobs available right now. Check back soon for new opportunities."}
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Job cards */}
        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job, index) => (
                <motion.article
                  key={job.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.25),
                  }}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Building2 size={22} />
                    </div>

                    {job.categoryName && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {job.categoryName}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-indigo-600">
                    {job.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Building2 size={15} />
                    {job.companyName}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700">
                      <BriefcaseBusiness size={13} />
                      {formatJobType(job.jobType)}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                      <MapPin size={13} />
                      {job.location}
                    </span>
                  </div>

                  <p className="mt-5 flex-1 text-sm leading-6 text-slate-500">
                    {truncateText(job.description)}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    {job.salary && (
                      <p className="text-sm font-semibold text-slate-800">
                        Salary:{" "}
                        <span className="font-medium text-slate-500">
                          {job.salary}
                        </span>
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={14} />
                        {formatDate(job.deadline)}
                      </span>

                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                      >
                        View Details
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}