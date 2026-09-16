"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";

type Job = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  deadline: string | null;
};

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load this job.");
          return;
        }

        setJob(data.job);
      } catch {
        setError("Unable to load this job. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (coverLetter.trim().length < 50) {
      setError("Cover letter must be at least 50 characters.");
      return;
    }

    if (coverLetter.trim().length > 5000) {
      setError("Cover letter cannot exceed 5000 characters.");
      return;
    }

    if (resumeUrl.trim()) {
      try {
        new URL(resumeUrl.trim());
      } catch {
        setError("Please enter a valid resume URL.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          coverLetter: coverLetter.trim(),
          resumeUrl: resumeUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to submit your application.");
        return;
      }

      setSuccess("Your application has been submitted successfully.");

      setTimeout(() => {
        router.push("/dashboard/candidate/applications");
      }, 1000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="h-8 w-64 rounded bg-slate-200" />
          <div className="mt-4 h-5 w-96 max-w-full rounded bg-slate-200" />
          <div className="mt-10 h-96 rounded-3xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <BriefcaseBusiness className="mx-auto h-12 w-12 text-slate-400" />
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Job unavailable
          </h1>
          <p className="mt-2 text-slate-500">
            {error || "This job could not be found."}
          </p>

          <Link
            href="/jobs"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Jobs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Details
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-8"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Job Application
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Apply for {job.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span>{job.companyName}</span>
              <span>{job.location}</span>
              <span>{job.jobType.replace("_", " ")}</span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <label
                htmlFor="coverLetter"
                className="text-sm font-semibold text-slate-900"
              >
                Cover Letter
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Tell the employer why you are a strong fit for this role.
              </p>

              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                rows={9}
                maxLength={5000}
                placeholder="Write your cover letter here..."
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <div className="mt-2 text-right text-xs text-slate-400">
                {coverLetter.length}/5000
              </div>
            </div>

            <div className="mt-7">
              <label
                htmlFor="resumeUrl"
                className="text-sm font-semibold text-slate-900"
              >
                Resume URL
                <span className="ml-1 font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <p className="mt-1 text-sm text-slate-500">
                Add a public link to your resume, such as Google Drive or
                another document link.
              </p>

              <input
                id="resumeUrl"
                type="url"
                value={resumeUrl}
                onChange={(event) => setResumeUrl(event.target.value)}
                placeholder="https://example.com/my-resume.pdf"
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {success}
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href={`/jobs/${job.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}