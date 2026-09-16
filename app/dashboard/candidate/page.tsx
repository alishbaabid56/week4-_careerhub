
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  UserRound,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, jobs } from "@/db/schema";
import { and, desc, eq, count } from "drizzle-orm";

export default async function CandidateDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as typeof session.user & {
    role?: string;
  };

  if (user.role !== "candidate") {
    if (user.role === "employer") {
      redirect("/dashboard/employer");
    }

    if (user.role === "admin") {
      redirect("/dashboard/admin");
    }

    redirect("/login");
  }

  // Fetch candidate application statistics
  const [totalApplications] = await db
    .select({
      count: count(),
    })
    .from(applications)
    .where(eq(applications.candidateId, user.id));

  const [underReviewApplications] = await db
    .select({
      count: count(),
    })
    .from(applications)
    .where(
      and(
        eq(applications.candidateId, user.id),
        eq(applications.status, "under_review")
      )
    );

  const [shortlistedApplications] = await db
    .select({
      count: count(),
    })
    .from(applications)
    .where(
      and(
        eq(applications.candidateId, user.id),
        eq(applications.status, "shortlisted")
      )
    );

  // Fetch recent applications
  const recentApplications = await db
    .select({
      id: applications.id,
      jobId: applications.jobId,
      jobTitle: jobs.title,
      companyName: jobs.companyName,
      location: jobs.location,
      status: applications.status,
      appliedAt: applications.appliedAt,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(applications.candidateId, user.id))
    .orderBy(desc(applications.appliedAt))
    .limit(4);

  const stats = [
    {
      label: "Applications",
      value: String(totalApplications?.count ?? 0),
      icon: FileText,
    },
    {
      label: "Under Review",
      value: String(underReviewApplications?.count ?? 0),
      icon: Clock3,
    },
    {
      label: "Shortlisted",
      value: String(shortlistedApplications?.count ?? 0),
      icon: CheckCircle2,
    },
  ];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      applied: "Applied",
      under_review: "Under Review",
      shortlisted: "Shortlisted",
      interview: "Interview",
      accepted: "Accepted",
      rejected: "Rejected",
    };

    return labels[status] || "Applied";
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      applied: "bg-blue-50 text-blue-700",
      under_review: "bg-amber-50 text-amber-700",
      shortlisted: "bg-emerald-50 text-emerald-700",
      interview: "bg-violet-50 text-violet-700",
      accepted: "bg-green-50 text-green-700",
      rejected: "bg-red-50 text-red-700",
    };

    return classes[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <section>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Candidate Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Welcome back, {user.name?.split(" ")[0] || "Candidate"} 👋
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your profile, discover opportunities, and keep track of
                your applications from one place.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
            >
              <BriefcaseBusiness size={16} />
              Find Jobs
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>

                    <p className="mt-2 text-3xl font-bold text-slate-950">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main Content */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.4fr]">
          {/* Recent Applications */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Recent Applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track the latest jobs you have applied for.
                </p>
              </div>

              <Link
                href="/dashboard/candidate/applications"
                className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                View all
              </Link>
            </div>

            {recentApplications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        {application.jobTitle}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {application.companyName}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} />
                          {application.location}
                        </span>

                        <span>
                          {new Date(
                            application.appliedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {getStatusLabel(application.status)}
                      </span>

                      <Link
                        href={`/jobs/${application.jobId}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                      >
                        View
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-12 text-center sm:px-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FileText size={25} />
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  No applications yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Start exploring available opportunities and submit your first
                  application.
                </p>

                <Link
                  href="/jobs"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Explore Jobs
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserRound size={20} />
            </div>

            <h2 className="mt-5 font-semibold text-slate-900">
              Complete your profile
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add your skills, education, experience, and resume to make your
              profile stronger.
            </p>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">
                  Profile progress
                </span>

                <span className="font-semibold text-indigo-600">20%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[20%] rounded-full bg-indigo-600" />
              </div>
            </div>

            <Link
              href="/dashboard/candidate/profile"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
            >
              <UserRound size={16} />
              Complete Profile
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Browse Jobs */}
            <Link
              href="/jobs"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >
              <BriefcaseBusiness
                size={21}
                className="text-indigo-600"
              />

              <h3 className="mt-4 font-semibold text-slate-900">
                Browse Jobs
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Find opportunities matching your career goals.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                Explore
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>

            {/* Update Profile */}
            <Link
              href="/dashboard/candidate/profile"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >
              <UserRound size={21} className="text-indigo-600" />

              <h3 className="mt-4 font-semibold text-slate-900">
                Update Profile
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your skills and experience to stand out.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                Update
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>

            {/* My Applications */}
            <Link
              href="/dashboard/candidate/applications"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >
              <FileText size={21} className="text-indigo-600" />

              <h3 className="mt-4 font-semibold text-slate-900">
                My Applications
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review the status of your submitted applications.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                View applications
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

