
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Plus,
  Settings,
  Users,
  XCircle,
} from "lucide-react";
import { count, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, jobs } from "@/db/schema";

export default async function EmployerDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Authentication check
  if (!session?.user) {
    redirect("/login");
  }

  // Employer-only access
  if (session.user.role !== "employer") {
    if (session.user.role === "candidate") {
      redirect("/dashboard/candidate");
    }

    if (session.user.role === "admin") {
      redirect("/dashboard/admin");
    }

    redirect("/");
  }

  const employerId = session.user.id;

  // Dashboard data
  const [
    totalJobsResult,
    totalApplicationsResult,
    recentJobs,
    statusResults,
  ] = await Promise.all([
    // Total jobs
    db
      .select({
        count: count(),
      })
      .from(jobs)
      .where(eq(jobs.employerId, employerId)),

    // Total applications received
    db
      .select({
        count: count(),
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(eq(jobs.employerId, employerId)),

    // Recent jobs
    db
      .select({
        id: jobs.id,
        title: jobs.title,
        companyName: jobs.companyName,
        location: jobs.location,
        status: jobs.status,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .where(eq(jobs.employerId, employerId))
      .orderBy(desc(jobs.createdAt))
      .limit(5),

    // Job status counts
    db
      .select({
        status: jobs.status,
        count: count(),
      })
      .from(jobs)
      .where(eq(jobs.employerId, employerId))
      .groupBy(jobs.status),
  ]);

  const totalJobs = totalJobsResult[0]?.count ?? 0;
  const totalApplications = totalApplicationsResult[0]?.count ?? 0;

  const approvedJobs =
    statusResults.find((item) => item.status === "approved")?.count ?? 0;

  const pendingJobs =
    statusResults.find((item) => item.status === "pending")?.count ?? 0;

  const rejectedJobs =
    statusResults.find((item) => item.status === "rejected")?.count ?? 0;

  const closedJobs =
    statusResults.find((item) => item.status === "closed")?.count ?? 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Employer Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back, {session.user.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your job postings, review applications, and monitor your
                hiring activity from one place.
              </p>
            </div>

            <Link
              href="/dashboard/employer/jobs/new"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
            >
              <Plus size={18} />
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Jobs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Jobs
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalJobs}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <BriefcaseBusiness size={21} />
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Approved Jobs
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {approvedJobs}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Jobs
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {pendingJobs}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock3 size={21} />
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalApplications}
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <Users size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent Jobs */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Recent Jobs
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your latest job postings.
                  </p>
                </div>

                <Link
                  href="/dashboard/employer/jobs"
                  className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col gap-4 p-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-semibold text-slate-900">
                            {job.title}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              job.status === "approved"
                                ? "bg-emerald-50 text-emerald-700"
                                : job.status === "pending"
                                  ? "bg-amber-50 text-amber-700"
                                  : job.status === "rejected"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {job.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                          <span>{job.companyName}</span>
                          <span>{job.location}</span>
                        </div>
                      </div>

                      {/* FIXED: Manage Job now opens edit page */}
                      <Link
                        href={`/dashboard/employer/jobs/${job.id}/edit`}
                        className="inline-flex w-fit shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                      >
                        Manage Job
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <BriefcaseBusiness size={22} />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-slate-900">
                      No jobs yet
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Create your first job posting to start hiring.
                    </p>

                    <Link
                      href="/dashboard/employer/jobs/new"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <Plus size={16} />
                      Create Job
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your hiring workflow.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {/* Manage Jobs */}
                <Link
                  href="/dashboard/employer/jobs"
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 transition group-hover:bg-indigo-100">
                      <BriefcaseBusiness size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        Manage Jobs
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Create, edit, and manage your job postings.
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Applications */}
                <Link
                  href="/dashboard/employer/applications"
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-violet-50 p-3 text-violet-600 transition group-hover:bg-violet-100">
                      <FileText size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        Applications
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Review and manage candidate applications.
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Employer Profile */}
                <Link
                  href="/dashboard/employer/profile"
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition group-hover:bg-emerald-100">
                      <Settings size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        Company Profile
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        Update your company information and details.
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hiring Overview */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Hiring Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current status of your job postings.
              </p>
            </div>

            <Link
              href="/dashboard/employer/jobs"
              className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Manage Jobs
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Approved */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={20}
                  className="text-emerald-600"
                />

                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Approved
                  </p>

                  <p className="mt-1 text-2xl font-bold text-emerald-900">
                    {approvedJobs}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
              <div className="flex items-center gap-3">
                <Clock3 size={20} className="text-amber-600" />

                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Pending
                  </p>

                  <p className="mt-1 text-2xl font-bold text-amber-900">
                    {pendingJobs}
                  </p>
                </div>
              </div>
            </div>

            {/* Rejected */}
            <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
              <div className="flex items-center gap-3">
                <XCircle size={20} className="text-red-600" />

                <div>
                  <p className="text-sm font-medium text-red-700">
                    Rejected
                  </p>

                  <p className="mt-1 text-2xl font-bold text-red-900">
                    {rejectedJobs}
                  </p>
                </div>
              </div>
            </div>

            {/* Closed */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness
                  size={20}
                  className="text-slate-600"
                />

                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Closed
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {closedJobs}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

