
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Send,
  Wallet,
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
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatDescription(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function JobDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/jobs/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Job not found.");
        }

        setJob(data.job);
      } catch (err) {
        console.error("Job details error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this job."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadJob();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 h-5 w-28 animate-pulse rounded bg-slate-200" />

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <div className="mb-6 h-6 w-28 animate-pulse rounded-full bg-slate-200" />
              <div className="mb-4 h-12 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="mb-10 h-5 w-1/2 animate-pulse rounded bg-slate-200" />

              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
              </div>
            </div>

            <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </section>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <BriefcaseBusiness className="h-8 w-8 text-slate-500" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Job not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              {error ||
                "This job may have been removed or is no longer available."}
            </p>

            <Link
              href="/jobs"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          </motion.div>
        </section>
      </main>
    );
  }

  const description = formatDescription(job.description);
  const requirements = formatDescription(job.requirements || "");

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <Link
            href="/jobs"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                {job.categoryName && (
                  <span className="rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
                    {job.categoryName}
                  </span>
                )}

                <span className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600">
                  {formatJobType(job.jobType)}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {job.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-500" />
                  {job.companyName}
                </span>

                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  {job.location}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-indigo-500" />
                  Posted{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(job.createdAt))}
                </span>
              </div>
            </div>

            <Link
              href={`/jobs/${job.id}/apply`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 hover:shadow-indigo-600/30"
            >
              <Send className="h-4 w-4" />
              Apply Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                About the Role
              </h2>

              <div className="mt-6 space-y-4 text-[15px] leading-7 text-slate-600">
                {description.length > 0 ? (
                  description.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))
                ) : (
                  <p>
                    The employer has not provided a detailed job
                    description yet.
                  </p>
                )}
              </div>
            </div>

            <div className="my-10 h-px bg-slate-200" />

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Requirements
              </h2>

              {requirements.length > 0 ? (
                <ul className="mt-6 space-y-4">
                  {requirements.map((requirement, index) => (
                    <li
                      key={`${requirement}-${index}`}
                      className="flex items-start gap-3 text-[15px] leading-7 text-slate-600"
                    >
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-indigo-600" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-[15px] leading-7 text-slate-500">
                  No specific requirements have been provided for this
                  position.
                </p>
              )}
            </div>

            <div className="mt-10 rounded-2xl bg-indigo-50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <Send className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Ready to apply?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Submit your application and take the next step in
                    your career journey.
                  </p>

                  <Link
                    href={`/jobs/${job.id}/apply`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
                  >
                    Apply for this position
                    <Send className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">
                Job Overview
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Job Type
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatJobType(job.jobType)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {job.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Wallet className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Salary
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {job.salary || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Application Deadline
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDate(job.deadline)}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={`/jobs/${job.id}/apply`}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Send className="h-4 w-4" />
                Apply Now
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Hiring Company
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {job.companyName}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                Explore this opportunity and submit your application
                through CareerHub.
              </p>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-950">
            Looking for more opportunities?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Browse more jobs and discover opportunities that match your
            skills and career goals.
          </p>

          <Link
            href="/jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-600"
          >
            Browse All Jobs
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </section>
    </main>
  );
}

