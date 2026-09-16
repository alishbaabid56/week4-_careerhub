import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq, count } from "drizzle-orm";
import { Users, BriefcaseBusiness, FileText, Tags, UserCheck, Clock3 } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  users,
  jobs,
  applications,
  categories,
} from "@/db/schema";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Authentication check
  if (!session?.user) {
    redirect("/login");
  }

  // Admin-only authorization
  if (session.user.role !== "admin") {
    redirect("/");
  }

  const [
    totalUsers,
    totalCandidates,
    totalEmployers,
    totalJobs,
    pendingJobs,
    approvedJobs,
    totalApplications,
    totalCategories,
  ] = await Promise.all([
    db.select({ count: count() }).from(users),

    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "candidate")),

    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "employer")),

    db.select({ count: count() }).from(jobs),

    db
      .select({ count: count() })
      .from(jobs)
      .where(eq(jobs.status, "pending")),

    db
      .select({ count: count() })
      .from(jobs)
      .where(eq(jobs.status, "approved")),

    db.select({ count: count() }).from(applications),

    db.select({ count: count() }).from(categories),
  ]);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers[0]?.count ?? 0,
      description: "Registered accounts",
      icon: Users,
    },
    {
      title: "Candidates",
      value: totalCandidates[0]?.count ?? 0,
      description: "Job seekers",
      icon: UserCheck,
    },
    {
      title: "Employers",
      value: totalEmployers[0]?.count ?? 0,
      description: "Hiring companies",
      icon: BriefcaseBusiness,
    },
    {
      title: "Total Jobs",
      value: totalJobs[0]?.count ?? 0,
      description: "All posted jobs",
      icon: BriefcaseBusiness,
    },
    {
      title: "Pending Jobs",
      value: pendingJobs[0]?.count ?? 0,
      description: "Waiting for review",
      icon: Clock3,
    },
    {
      title: "Approved Jobs",
      value: approvedJobs[0]?.count ?? 0,
      description: "Published jobs",
      icon: BriefcaseBusiness,
    },
    {
      title: "Applications",
      value: totalApplications[0]?.count ?? 0,
      description: "Submitted applications",
      icon: FileText,
    },
    {
      title: "Categories",
      value: totalCategories[0]?.count ?? 0,
      description: "Job categories",
      icon: Tags,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Admin Panel
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Welcome back, {session.user.name}. Here&apos;s an overview of CareerHub.
          </p>
        </div>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-3">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Management Overview */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Job Moderation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-3">
                <Clock3 className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Job Moderation
                </h2>

                <p className="text-sm text-slate-500">
                  Review and manage employer job postings.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-sm text-amber-700">
                  Pending Review
                </p>

                <p className="mt-1 text-2xl font-bold text-amber-900">
                  {pendingJobs[0]?.count ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-sm text-emerald-700">
                  Approved
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-900">
                  {approvedJobs[0]?.count ?? 0}
                </p>
              </div>
            </div>

           <Link
  href="/dashboard/admin/jobs"
  className="mt-5 block w-full rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
>
  Manage Jobs
</Link>
          </div>

          {/* User Management */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  User Management
                </h2>

                <p className="text-sm text-slate-500">
                  Monitor candidates and employers.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-indigo-50 p-4">
                <p className="text-sm text-indigo-700">
                  Candidates
                </p>

                <p className="mt-1 text-2xl font-bold text-indigo-900">
                  {totalCandidates[0]?.count ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-4">
                <p className="text-sm text-violet-700">
                  Employers
                </p>

                <p className="mt-1 text-2xl font-bold text-violet-900">
                  {totalEmployers[0]?.count ?? 0}
                </p>
              </div>
            </div>

           <Link
  href="/dashboard/admin/users"
  className="mt-5 block w-full rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
>
  Manage Users
</Link>
          </div>
        </section>

        {/* Platform Summary */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Platform Summary
              </h2>

              <p className="text-sm text-slate-500">
                Current CareerHub activity at a glance.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Applications
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalApplications[0]?.count ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Jobs
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalJobs[0]?.count ?? 0}
              </p>
            </div>

           <Link
  href="/dashboard/admin/categories"
  className="block rounded-xl border border-slate-100 bg-slate-50 p-5 transition hover:border-indigo-200 hover:bg-indigo-50"
>
  <p className="text-sm text-slate-500">
    Categories
  </p>

  <p className="mt-2 text-2xl font-bold text-slate-900">
    {totalCategories[0]?.count ?? 0}
  </p>

  <p className="mt-2 text-xs font-medium text-indigo-600">
    Manage Categories →
  </p>
</Link>
          </div>
        </section>
      </div>
    </main>
  );
}