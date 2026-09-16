
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";

type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "accepted"
  | "rejected";

type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  coverLetter: string | null;
  resumeUrl: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;

  jobTitle: string;
  companyName: string;

  candidateName: string;
  candidateEmail: string;

  profileBio: string | null;
  profileSkills: string | null;
  profileEducation: string | null;
  profileExperience: string | null;
  profileResumeUrl: string | null;
  profilePhotoUrl: string | null;
};

const statusOptions: {
  value: ApplicationStatus;
  label: string;
}[] = [
  { value: "applied", label: "Applied" },
  { value: "under_review", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

function statusLabel(status: ApplicationStatus) {
  return (
    statusOptions.find((item) => item.value === status)?.label ?? status
  );
}

function statusClasses(status: ApplicationStatus) {
  switch (status) {
    case "accepted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    case "shortlisted":
      return "border-violet-200 bg-violet-50 text-violet-700";

    case "interview":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "under_review":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function statusIcon(status: ApplicationStatus) {
  switch (status) {
    case "accepted":
      return <CheckCircle2 className="h-4 w-4" />;

    case "rejected":
      return <XCircle className="h-4 w-4" />;

    case "under_review":
      return <Clock3 className="h-4 w-4" />;

    default:
      return <UserRound className="h-4 w-4" />;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      setError("");

      const response = await fetch("/api/employer/applications");

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load applications.");
        return;
      }

      setApplications(data.applications ?? []);
    } catch {
      setError("Unable to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function updateStatus(
    applicationId: string,
    status: ApplicationStatus
  ) {
    setUpdatingId(applicationId);
    setError("");

    try {
      const response = await fetch(
        `/api/employer/applications/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to update application.");
        return;
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: data.application.status,
                updatedAt: data.application.updatedAt,
              }
            : application
        )
      );
    } catch {
      setError("Unable to update application status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredApplications = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !keyword ||
        application.candidateName.toLowerCase().includes(keyword) ||
        application.candidateEmail.toLowerCase().includes(keyword) ||
        application.jobTitle.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      review: applications.filter(
        (item) => item.status === "under_review"
      ).length,
      shortlisted: applications.filter(
        (item) => item.status === "shortlisted"
      ).length,
      accepted: applications.filter(
        (item) => item.status === "accepted"
      ).length,
    };
  }, [applications]);

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard/employer"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employer Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                <UserRound className="h-3.5 w-3.5" />
                Talent Management
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Applications
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Review candidates, explore their profiles, and move applicants
                through your hiring process.
              </p>
            </div>

            <Link
              href="/dashboard/employer/jobs/${job.id}/edit"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <BriefcaseBusiness className="h-4 w-4" />
              Manage Jobs
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Applications",
              value: stats.total,
              icon: UserRound,
            },
            {
              label: "Under Review",
              value: stats.review,
              icon: Clock3,
            },
            {
              label: "Shortlisted",
              value: stats.shortlisted,
              icon: CheckCircle2,
            },
            {
              label: "Accepted",
              value: stats.accepted,
              icon: CheckCircle2,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-4 w-4" />
                </div>

                <p className="text-2xl font-bold text-slate-950">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search candidate or job..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-3xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
              <UserRound className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No applications found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Applications from candidates will appear here when they apply
              to your approved job postings.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredApplications.map((application, index) => (
              <motion.article
                key={application.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Candidate */}
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50 font-bold text-indigo-600">
                      {application.profilePhotoUrl ? (
                        <img
                          src={application.profilePhotoUrl}
                          alt={`${application.candidateName} profile`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        application.candidateName
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-950">
                        {application.candidateName}
                      </h2>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {application.candidateEmail}
                        </span>

                        <span>
                          Applied {formatDate(application.appliedAt)}
                        </span>
                      </div>

                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                        <BriefcaseBusiness className="h-3.5 w-3.5" />
                        {application.jobTitle}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClasses(
                      application.status
                    )}`}
                  >
                    {statusIcon(application.status)}
                    {statusLabel(application.status)}
                  </div>
                </div>

                {/* Candidate Details */}
                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-2">
                  {application.profileBio && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Bio
                      </p>

                      <p className="text-sm leading-6 text-slate-600">
                        {application.profileBio}
                      </p>
                    </div>
                  )}

                  {application.profileSkills && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Skills
                      </p>

                      <p className="text-sm leading-6 text-slate-600">
                        {application.profileSkills}
                      </p>
                    </div>
                  )}

                  {application.profileEducation && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Education
                      </p>

                      <p className="text-sm leading-6 text-slate-600">
                        {application.profileEducation}
                      </p>
                    </div>
                  )}

                  {application.profileExperience && (
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Experience
                      </p>

                      <p className="text-sm leading-6 text-slate-600">
                        {application.profileExperience}
                      </p>
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                {application.coverLetter && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Cover Letter
                    </p>

                    <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {(application.resumeUrl ||
                      application.profileResumeUrl) && (
                      <a
                        href={
                          application.resumeUrl ||
                          application.profileResumeUrl ||
                          "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FileText className="h-4 w-4" />
                        View Resume
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={application.status}
                      disabled={updatingId === application.id}
                      onChange={(event) =>
                        updateStatus(
                          application.id,
                          event.target.value as ApplicationStatus
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
                    >
                      {statusOptions.map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </option>
                      ))}
                    </select>

                    {updatingId === application.id && (
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

