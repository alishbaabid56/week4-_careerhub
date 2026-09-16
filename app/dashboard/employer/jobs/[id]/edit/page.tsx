
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  Save,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  description?: string | null;
};

type Job = {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: "full_time" | "part_time" | "internship" | "contract" | "remote";
  salary: string | null;
  requirements: string | null;
  deadline: string | null;
  categoryId: string | null;
};

const initialForm = {
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

const jobTypeLabels: Record<Job["jobType"], string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  internship: "Internship",
  contract: "Contract",
  remote: "Remote",
};

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [jobResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/employer/jobs/${id}`, {
            cache: "no-store",
          }),
          fetch("/api/categories", {
            cache: "no-store",
          }),
        ]);

        const jobData = await jobResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (!jobResponse.ok) {
          throw new Error(
            jobData.message || "Unable to load this job posting."
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            categoriesData.message || "Unable to load categories."
          );
        }

        const job: Job = jobData.job;

        setForm({
          title: job.title || "",
          description: job.description || "",
          companyName: job.companyName || "",
          location: job.location || "",
          jobType: job.jobType || "full_time",
          salary: job.salary || "",
          requirements: job.requirements || "",
          deadline: job.deadline
            ? new Date(job.deadline).toISOString().split("T")[0]
            : "",
          categoryId: job.categoryId || "",
        });

        setCategories(categoriesData.categories || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the job posting."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function updateField(field: string, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm() {
    if (form.title.trim().length < 3) {
      return "Job title must be at least 3 characters.";
    }

    if (form.description.trim().length < 20) {
      return "Description must be at least 20 characters.";
    }

    if (form.companyName.trim().length < 2) {
      return "Company name must be at least 2 characters.";
    }

    if (form.location.trim().length < 2) {
      return "Location must be at least 2 characters.";
    }

    if (form.salary.length > 150) {
      return "Salary information is too long.";
    }

    if (form.requirements.length > 5000) {
      return "Requirements cannot exceed 5000 characters.";
    }

    if (form.deadline) {
      const deadlineDate = new Date(form.deadline);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        return "Deadline cannot be in the past.";
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

    try {
      setSaving(true);

      const response = await fetch(`/api/employer/jobs/${id}`, {
        method: "PUT",
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
  deadline: form.deadline || "",
  categoryId: form.categoryId || "",
}),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to update this job.");
        return;
      }

      setSuccess(
        "Job updated successfully. It has been sent for admin approval again."
      );

      setTimeout(() => {
        router.push("/dashboard/employer/jobs");
        router.refresh();
      }, 1000);
    } catch {
      setError("Something went wrong while updating the job.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto flex max-w-4xl items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard/employer/jobs")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Edit Job Posting
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Update your job details and submit the posting for approval.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Job Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Provide clear information about the opportunity.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Job Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  maxLength={150}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.title.length}/150
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Describe the role, responsibilities, and what the candidate will work on..."
                  rows={7}
                  maxLength={5000}
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.description.length}/5000
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      value={form.companyName}
                      onChange={(e) =>
                        updateField("companyName", e.target.value)
                      }
                      placeholder="Company name"
                      maxLength={150}
                      className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      value={form.location}
                      onChange={(e) =>
                        updateField("location", e.target.value)
                      }
                      placeholder="e.g. Karachi, Pakistan"
                      maxLength={150}
                      className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Job Type
                  </label>
                  <select
                    value={form.jobType}
                    onChange={(e) =>
                      updateField("jobType", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >
                    {Object.entries(jobTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      updateField("categoryId", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Salary
                  </label>
                  <input
                    value={form.salary}
                    onChange={(e) => updateField("salary", e.target.value)}
                    placeholder="e.g. PKR 80,000 - 120,000"
                    maxLength={150}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Application Deadline
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) =>
                        updateField("deadline", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Requirements
                </label>
                <textarea
                  value={form.requirements}
                  onChange={(e) =>
                    updateField("requirements", e.target.value)
                  }
                  placeholder="List skills, qualifications, experience, or other requirements..."
                  rows={6}
                  maxLength={5000}
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.requirements.length}/5000
                </p>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/dashboard/employer/jobs")}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            <strong>Approval notice:</strong> Updating a job sends it back to
            <strong> Pending</strong> status so an admin can review the
            changes before it becomes visible to candidates.
          </div>
        </motion.form>
      </div>
    </main>
  );
}

