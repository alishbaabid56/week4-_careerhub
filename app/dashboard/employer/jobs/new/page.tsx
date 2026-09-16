
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

type FormData = {
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: string;
  salary: string;
  requirements: string;
  deadline: string;
  categoryId: string;
};

const initialForm: FormData = {
  title: "",
  description: "",
  companyName: "",
  location: "",
  jobType: "full_time",
  salary: "",
  requirements: "",
  deadline: "",
  categoryId: "",
};

const jobTypes = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
];

export default function NewJobPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesResponse, profileResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/employer/profile"),
        ]);

        const categoriesData = await categoriesResponse.json();
        const profileData = await profileResponse.json();

        if (categoriesResponse.ok && categoriesData.success) {
          setCategories(categoriesData.categories ?? []);
        }

        if (profileResponse.ok && profileData.success && profileData.profile) {
          setForm((current) => ({
            ...current,
            companyName: profileData.profile.companyName ?? "",
          }));
        }
      } catch {
        setError("Unable to load job form data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function updateField(field: keyof FormData, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  }

  function validateForm() {
    if (form.title.trim().length < 3) {
      return "Job title must be at least 3 characters.";
    }

    if (form.description.trim().length < 20) {
      return "Job description must be at least 20 characters.";
    }

    if (form.companyName.trim().length < 2) {
      return "Company name must be at least 2 characters.";
    }

    if (form.location.trim().length < 2) {
      return "Please enter a valid job location.";
    }

    if (!form.jobType) {
      return "Please select a job type.";
    }

    if (form.salary.trim().length > 150) {
      return "Salary information is too long.";
    }

    if (form.requirements.trim().length > 5000) {
      return "Requirements cannot exceed 5000 characters.";
    }

    if (form.deadline) {
      const selectedDate = new Date(`${form.deadline}T23:59:59`);
      if (Number.isNaN(selectedDate.getTime())) {
        return "Please enter a valid application deadline.";
      }
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          companyName: form.companyName.trim(),
          location: form.location.trim(),
          jobType: form.jobType,
          salary: form.salary.trim(),
          requirements: form.requirements.trim(),
          deadline: form.deadline,
          categoryId: form.categoryId || "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create the job posting.");
        setSaving(false);
        return;
      }

      setSuccess(
        "Job posted successfully. It has been submitted for admin review."
      );

      setTimeout(() => {
        window.location.href = "/dashboard/employer/jobs";
      }, 1200);
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-56 rounded-lg bg-slate-200" />
            <div className="h-4 w-96 max-w-full rounded bg-slate-100" />
            <div className="h-[600px] rounded-3xl border border-slate-200 bg-slate-50" />
          </div>
        </div>
      </main>
    );
  }

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
            href="/dashboard/employer/jobs"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Management
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                Employer Workspace
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Create a New Job
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Publish a clear and professional job opportunity. New postings
                are submitted for admin review before appearing publicly.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 md:flex">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Admin approval required
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main Form */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Job Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add the essential details candidates need to understand
                    your opportunity.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Job Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Job Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="title"
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="e.g. Frontend Developer"
                    maxLength={150}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />

                  <div className="mt-1.5 text-right text-xs text-slate-400">
                    {form.title.length}/150
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Job Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Describe the role, responsibilities, team, and what the successful candidate will work on..."
                    rows={7}
                    maxLength={5000}
                    required
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />

                  <div className="mt-1.5 flex justify-between text-xs text-slate-400">
                    <span>Minimum 20 characters</span>
                    <span>{form.description.length}/5000</span>
                  </div>
                </div>

                {/* Company + Location */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Company Name <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="companyName"
                        value={form.companyName}
                        onChange={(event) =>
                          updateField("companyName", event.target.value)
                        }
                        placeholder="Your company"
                        maxLength={150}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Location <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="location"
                        value={form.location}
                        onChange={(event) =>
                          updateField("location", event.target.value)
                        }
                        placeholder="e.g. Karachi, Pakistan"
                        maxLength={150}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Type + Category */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="jobType"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Job Type <span className="text-red-500">*</span>
                    </label>

                    <select
                      id="jobType"
                      value={form.jobType}
                      onChange={(event) =>
                        updateField("jobType", event.target.value)
                      }
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    >
                      {jobTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="categoryId"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Category
                    </label>

                    <select
                      id="categoryId"
                      value={form.categoryId}
                      onChange={(event) =>
                        updateField("categoryId", event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    >
                      <option value="">Select a category</option>

                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>

                    {categories.length === 0 && (
                      <p className="mt-1.5 text-xs text-slate-400">
                        No categories available yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Salary + Deadline */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="salary"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Salary
                    </label>

                    <div className="relative">
                      <Globe2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="salary"
                        value={form.salary}
                        onChange={(event) =>
                          updateField("salary", event.target.value)
                        }
                        placeholder="e.g. PKR 100,000 - 150,000"
                        maxLength={150}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="deadline"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Application Deadline
                    </label>

                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="deadline"
                        type="date"
                        value={form.deadline}
                        onChange={(event) =>
                          updateField("deadline", event.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label
                    htmlFor="requirements"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Requirements
                  </label>

                  <textarea
                    id="requirements"
                    value={form.requirements}
                    onChange={(event) =>
                      updateField("requirements", event.target.value)
                    }
                    placeholder="List skills, qualifications, education, experience, or other requirements..."
                    rows={6}
                    maxLength={5000}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />

                  <div className="mt-1.5 text-right text-xs text-slate-400">
                    {form.requirements.length}/5000
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                  <Link
                    href="/dashboard/employer/jobs"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Publish Job
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
              className="space-y-5"
            >
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-950">
                      Posting Checklist
                    </h3>
                    <p className="text-xs text-slate-500">
                      Before you publish
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: BriefcaseBusiness,
                      text: "Use a clear and specific job title.",
                    },
                    {
                      icon: FileText,
                      text: "Describe responsibilities in detail.",
                    },
                    {
                      icon: Users,
                      text: "Mention the skills candidates need.",
                    },
                    {
                      icon: Tag,
                      text: "Choose the most relevant category.",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.text}
                        className="flex gap-3 text-sm leading-5 text-slate-600"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                        <span>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
                <div className="mb-3 flex items-center gap-2 text-indigo-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <h3 className="font-semibold">Review Process</h3>
                </div>

                <p className="text-sm leading-6 text-indigo-900/70">
                  Your job will initially be marked as{" "}
                  <strong>Pending</strong>. An administrator must approve it
                  before candidates can discover and apply to the position.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Employer
                    </p>
                    <p className="font-semibold text-slate-900">
                      {form.companyName || "Your company"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </form>
      </div>
    </main>
  );
}

