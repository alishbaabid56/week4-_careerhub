"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Role = "candidate" | "employer";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create your account.");
        setLoading(false);
        return;
      }

      router.push(
        data.role === "employer"
          ? "/dashboard/employer"
          : "/dashboard/candidate"
      );
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_-25px_rgba(15,23,42,0.25)] lg:grid-cols-[0.95fr_1.05fr]">
          
          {/* LEFT PANEL */}
          <section className="relative hidden overflow-hidden bg-slate-950 p-8 text-white sm:p-10 lg:flex lg:min-h-[700px] lg:flex-col lg:justify-between lg:p-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10">
              <Link
                href="/"
                className="inline-flex items-center text-2xl font-bold tracking-tight"
              >
                Career<span className="text-indigo-400">Hub</span>
              </Link>

              <div className="mt-20 max-w-md xl:mt-28">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Build your career
                </div>

                <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                  Find opportunities that move your career forward.
                </h1>

                <p className="mt-6 max-w-lg text-sm leading-7 text-slate-300 xl:text-base">
                  Create your CareerHub account and discover jobs,
                  internships, and opportunities built around your goals.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Discover relevant career opportunities",
                    "Apply and track your applications",
                    "Connect with growing companies",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-indigo-400"
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="relative z-10 text-xs text-slate-500">
              CareerHub — Jobs & Internship Management Platform
            </p>
          </section>

          {/* RIGHT FORM */}
          <section className="flex items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
            <div className="mx-auto w-full max-w-md">
              
              {/* Mobile Logo */}
              <div className="mb-8 lg:hidden">
                <Link
                  href="/"
                  className="text-2xl font-bold tracking-tight text-slate-900"
                >
                  Career<span className="text-indigo-600">Hub</span>
                </Link>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold text-indigo-600">
                  Get started
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Join CareerHub and take the next step in your career journey.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* Role */}
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-slate-700">
                    I want to join as
                  </legend>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setRole("candidate")}
                      aria-pressed={role === "candidate"}
                      className={`flex min-h-[76px] items-center gap-3 rounded-xl border px-4 text-left transition ${
                        role === "candidate"
                          ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/10"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          role === "candidate"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <UserRound size={19} />
                      </span>

                      <span>
                        <span
                          className={`block text-sm font-semibold ${
                            role === "candidate"
                              ? "text-indigo-700"
                              : "text-slate-800"
                          }`}
                        >
                          Candidate
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          Find and apply for jobs
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("employer")}
                      aria-pressed={role === "employer"}
                      className={`flex min-h-[76px] items-center gap-3 rounded-xl border px-4 text-left transition ${
                        role === "employer"
                          ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/10"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          role === "employer"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <BriefcaseBusiness size={19} />
                      </span>

                      <span>
                        <span
                          className={`block text-sm font-semibold ${
                            role === "employer"
                              ? "text-indigo-700"
                              : "text-slate-800"
                          }`}
                        >
                          Employer
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          Post and manage jobs
                        </span>
                      </span>
                    </button>
                  </div>
                </fieldset>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 h-px bg-slate-100" />

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </p>

              <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                By creating an account, you agree to use CareerHub responsibly.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}