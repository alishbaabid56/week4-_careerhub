"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  Loader2,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

type Application = {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  categoryName: string | null;
  coverLetter: string;
  resumeUrl: string | null;
  status: string;
  appliedAt: string;
  updatedAt: string;
};

function formatJobType(type: string) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusStyles(status: string) {
  switch (status) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";

    case "shortlisted":
      return "bg-violet-50 text-violet-700 border-violet-200";

    case "interview":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "under_review":
      return "bg-amber-50 text-amber-700 border-amber-200";

    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await fetch("/api/applications");
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load your applications.");
          return;
        }

        setApplications(data.applications || []);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard/candidate"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-8"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Candidate Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            My Applications
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Track the jobs you have applied for and monitor your application
            status.
          </p>
        </motion.div>

        {loading && (
          <div className="mt-10 flex items-center justify-center rounded-3xl border border-slate-200 bg-white py-20 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading applications...
            </div>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
              <BriefcaseBusiness className="h-7 w-7 text-indigo-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No applications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You have not applied for any jobs yet. Explore available
              opportunities and submit your first application.
            </p>

            <Link
              href="/jobs"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore Jobs
            </Link>
          </motion.div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="mt-10 space-y-5">
            {applications.map((application, index) => (
              <motion.article
                key={application.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {application.categoryName && (
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                          {application.categoryName}
                        </span>
                      )}

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                          application.status
                        )}`}
                      >
                        {formatStatus(application.status)}
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-slate-950">
                      {application.jobTitle}
                    </h2>

                    <p className="mt-1 font-medium text-slate-600">
                      {application.companyName}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {application.location}
                      </span>

                      <span>{formatJobType(application.jobType)}</span>

                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        Applied {formatDate(application.appliedAt)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/jobs/${application.jobId}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    View Job
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Application Status
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your application is currently{" "}
                    <span className="font-semibold text-slate-900">
                      {formatStatus(application.status).toLowerCase()}
                    </span>
                    .
                  </p>

                  {application.resumeUrl && (
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      View Resume
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}