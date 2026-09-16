"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Loader2,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

type JobStatus = "pending" | "approved" | "rejected" | "closed";

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
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  employerId: string;
  employerName: string | null;
  employerEmail: string | null;
};

const statusOptions: { value: "all" | JobStatus; label: string }[] = [
  { value: "all", label: "All Jobs" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
];

const statusStyles: Record<JobStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
};

function formatStatus(status: JobStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatJobType(jobType: string) {
  return jobType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | JobStatus>("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status !== "all") {
        params.set("status", status);
      }

      const response = await fetch(`/api/admin/jobs?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load jobs.");
      }

      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Admin jobs page error:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load jobs."
      );
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadJobs]);

  const updateJobStatus = async (
    jobId: string,
    nextStatus: JobStatus
  ) => {
    try {
      setUpdatingId(jobId);
      setError("");
      setSuccess("");

      const response = await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update job.");
      }

      setSuccess(data.message || "Job status updated successfully.");

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: nextStatus,
                updatedAt: new Date().toISOString(),
              }
            : job
        )
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Admin job status update error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update job status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      pending: jobs.filter((job) => job.status === "pending").length,
      approved: jobs.filter((job) => job.status === "approved").length,
      rejected: jobs.filter((job) => job.status === "rejected").length,
      closed: jobs.filter((job) => job.status === "closed").length,
    };
  }, [jobs]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
              <ShieldCheck className="h-4 w-4" />
              Admin Panel
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Job Moderation
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Review, approve, reject, and manage employer job postings.
            </p>
          </div>

          <Link
            href="/dashboard/admin"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard
            label="Total"
            value={stats.total}
            icon={<BriefcaseBusiness className="h-5 w-5" />}
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<Clock3 className="h-5 w-5" />}
          />

          <StatCard
            label="Approved"
            value={stats.approved}
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={<XCircle className="h-5 w-5" />}
          />

          <StatCard
            label="Closed"
            value={stats.closed}
            icon={<ShieldCheck className="h-5 w-5" />}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs, companies, or locations..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="relative lg:w-56">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "all" | JobStatus)
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {success}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              Loading jobs...
            </div>
          </div>
        ) : jobs.length === 0 ? (
          /* Empty */
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
            <div className="mb-4 rounded-2xl bg-slate-100 p-4">
              <BriefcaseBusiness className="h-8 w-8 text-slate-400" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No jobs found
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Try changing your search or status filter. New employer
              job postings will appear here for moderation.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Job
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Employer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Type
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {job.title}
                            </p>

                            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                              <Building2 className="h-3.5 w-3.5" />
                              {job.companyName}
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                              {job.location}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-slate-800">
                            {job.employerName || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {job.employerEmail || "No email"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {formatJobType(job.jobType)}
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge status={job.status} />
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {formatDate(job.createdAt)}
                        </td>

                        <td className="px-6 py-5">
                          <ActionButtons
                            job={job}
                            updatingId={updatingId}
                            updateJobStatus={updateJobStatus}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="grid gap-4 lg:hidden">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold text-slate-900">
                        {job.title}
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <Building2 className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {job.companyName}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.location}
                      </p>
                    </div>

                    <StatusBadge status={job.status} />
                  </div>

                  <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Employer
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {job.employerName || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Job Type
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {formatJobType(job.jobType)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Created
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {formatDate(job.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Salary
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {job.salary || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ActionButtons
                      job={job}
                      updatingId={updatingId}
                      updateJobStatus={updateJobStatus}
                      fullWidth
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <p className="text-2xl font-bold text-slate-900">{value}</p>

      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function ActionButtons({
  job,
  updatingId,
  updateJobStatus,
  fullWidth = false,
}: {
  job: Job;
  updatingId: string | null;
  updateJobStatus: (jobId: string, status: JobStatus) => Promise<void>;
  fullWidth?: boolean;
}) {
  const isUpdating = updatingId === job.id;

  return (
    <div
      className={`flex flex-wrap gap-2 ${
        fullWidth ? "w-full" : "justify-end"
      }`}
    >
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => updateJobStatus(job.id, "approved")}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUpdating && job.status !== "approved" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        Approve
      </button>

      <button
        type="button"
        disabled={isUpdating}
        onClick={() => updateJobStatus(job.id, "rejected")}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <XCircle className="h-3.5 w-3.5" />
        Reject
      </button>

      <button
        type="button"
        disabled={isUpdating}
        onClick={() => updateJobStatus(job.id, "closed")}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Close
      </button>

      <button
        type="button"
        disabled={isUpdating}
        onClick={() => {
          const details = [
            `Job: ${job.title}`,
            `Company: ${job.companyName}`,
            `Location: ${job.location}`,
            `Type: ${formatJobType(job.jobType)}`,
            `Salary: ${job.salary || "Not specified"}`,
            `Employer: ${job.employerName || "Unknown"}`,
            `Deadline: ${
              job.deadline ? formatDate(job.deadline) : "Not specified"
            }`,
          ].join("\n");

          window.alert(details);
        }}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </button>
    </div>
  );
}