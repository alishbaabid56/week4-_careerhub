"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Code2,
  GraduationCap,
  HeartPulse,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

const categories = [
  {
    name: "Technology",
    jobs: "120+ opportunities",
    icon: Code2,
  },
  {
    name: "Design",
    jobs: "80+ opportunities",
    icon: Sparkles,
  },
  {
    name: "Healthcare",
    jobs: "65+ opportunities",
    icon: HeartPulse,
  },
  {
    name: "Education",
    jobs: "45+ opportunities",
    icon: GraduationCap,
  },
];

const featuredJobs = [
  {
    title: "Frontend Developer",
    company: "TechNova",
    location: "Karachi, Pakistan",
    type: "Full-time",
    category: "Technology",
  },
  {
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Remote",
    type: "Full-time",
    category: "Design",
  },
  {
    title: "Software Engineering Intern",
    company: "Innovate Labs",
    location: "Lahore, Pakistan",
    type: "Internship",
    category: "Technology",
  },
];

const benefits = [
  "Verified job opportunities",
  "Simple and secure applications",
  "Personalized candidate profiles",
  "Powerful tools for employers",
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.12),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.08),_transparent_30%)]" />

        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-700">
              <Sparkles size={15} />
              <span>Connecting talent with opportunity</span>
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Find the right opportunity.
              <span className="block text-indigo-600">
                Build your future.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              CareerHub makes it easier to discover meaningful jobs and
              internships while giving employers the tools they need to find
              great talent.
            </p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50"
              id="jobs"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_0.8fr_auto]">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <Search
                    size={19}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Job title, skill or keyword"
                    aria-label="Job title, skill or keyword"
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <MapPin
                    size={19}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    aria-label="Location"
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Search Jobs
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="font-medium text-slate-600">
                Popular:
              </span>
              <button
                type="button"
                className="transition hover:text-indigo-600"
              >
                Software Engineer
              </button>
              <button
                type="button"
                className="transition hover:text-indigo-600"
              >
                UI/UX Designer
              </button>
              <button
                type="button"
                className="transition hover:text-indigo-600"
              >
                Marketing
              </button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:block"
          >
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-6 rounded-[2rem] bg-indigo-100/60 blur-3xl" />

              <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Career overview
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Your next move
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <BriefcaseBusiness size={21} />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Users size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Opportunities that fit you
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Discover roles based on your skills.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      "Frontend Developer",
                      "Product Designer",
                      "Software Intern",
                    ].map((job, index) => (
                      <motion.div
                        key={job}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.45 + index * 0.1,
                        }}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {job}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            CareerHub opportunity
                          </p>
                        </div>

                        <ChevronRight
                          size={16}
                          className="text-slate-400"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      Applications
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      Track with ease
                    </p>
                  </div>

                  <CheckCircle2
                    size={22}
                    className="text-indigo-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="border-y border-slate-100 bg-slate-50/70 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Explore opportunities
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Find jobs by category
            </h2>

            <p className="mt-4 text-slate-600">
              Explore opportunities across growing industries and discover
              roles that match your career goals.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => {
              const Icon = category.icon;

              return (
                <motion.a
                  key={category.name}
                  href="#jobs"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {category.jobs}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-indigo-600">
                    Explore
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Featured opportunities
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Start your next chapter
              </h2>

              <p className="mt-4 max-w-2xl text-slate-600">
                Browse a preview of opportunities available through
                CareerHub.
              </p>
            </motion.div>

            <a
              href="/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all jobs
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredJobs.map((job, index) => (
              <motion.article
                key={job.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.1,
                }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {job.type}
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {job.category}
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {job.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-600">
                  {job.company}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} />
                  {job.location}
                </div>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  View opportunity
                  <ArrowRight size={15} />
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Why CareerHub */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
              Why CareerHub
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to move your career forward.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-300">
              From discovering opportunities to managing applications,
              CareerHub brings the essential career journey into one
              simple platform.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-indigo-400"
                  />

                  <span className="text-sm text-slate-200">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Users className="text-indigo-300" size={24} />
              <p className="mt-5 text-2xl font-bold">
                Candidates
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Build your profile, discover relevant roles and track
                every application.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <Building2 className="text-indigo-300" size={24} />
              <p className="mt-5 text-2xl font-bold">
                Employers
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create opportunities and manage applicants from one
                organized dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:col-span-2">
              <BriefcaseBusiness className="text-indigo-300" size={24} />
              <p className="mt-5 text-2xl font-bold">
                One connected platform
              </p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                A streamlined experience designed to connect ambitious
                candidates with organizations looking for their next
                great hire.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="employers"
        className="py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-12 text-center sm:px-12"
          >
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to take the next step?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-indigo-100">
                Whether you are searching for your next opportunity or
                looking for exceptional talent, CareerHub is built to
                help you move forward.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                >
                  Create an account
                  <ArrowRight size={16} />
                </Link>

                <a
                  href="#jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore opportunities
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}