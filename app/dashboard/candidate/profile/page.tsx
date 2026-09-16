
"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Save,
  User,
  XCircle,
} from "lucide-react";

type Profile = {
  bio: string;
  skills: string;
  education: string;
  experience: string;
  resumeUrl: string;
  photoUrl: string;
};

type Errors = Partial<Record<keyof Profile, string>>;

const emptyProfile: Profile = {
  bio: "",
  skills: "",
  education: "",
  experience: "",
  resumeUrl: "",
  photoUrl: "",
};

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/candidate/profile");

        if (!response.ok) {
          setError("Unable to load your profile.");
          return;
        }

        const data = await response.json();

        if (data.profile) {
          setProfile({
            bio: data.profile.bio ?? "",
            skills: data.profile.skills ?? "",
            education: data.profile.education ?? "",
            experience: data.profile.experience ?? "",
            resumeUrl: data.profile.resumeUrl ?? "",
            photoUrl: data.profile.photoUrl ?? "",
          });
        }
      } catch {
        setError("Something went wrong while loading your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(field: keyof Profile, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setMessage("");
    setError("");

    if (field === "photoUrl") {
      setImageError(false);
    }
  }

  function validateProfile() {
    const newErrors: Errors = {};

    if (profile.bio.trim().length > 1000) {
      newErrors.bio = "Bio must be 1000 characters or less.";
    }

    if (profile.skills.trim().length > 1000) {
      newErrors.skills = "Skills must be 1000 characters or less.";
    }

    if (profile.education.trim().length > 1000) {
      newErrors.education = "Education must be 1000 characters or less.";
    }

    if (profile.experience.trim().length > 2000) {
      newErrors.experience =
        "Experience must be 2000 characters or less.";
    }

    if (profile.resumeUrl.trim() && !isValidUrl(profile.resumeUrl.trim())) {
      newErrors.resumeUrl =
        "Please enter a valid URL starting with http:// or https://";
    }

    if (profile.photoUrl.trim() && !isValidUrl(profile.photoUrl.trim())) {
      newErrors.photoUrl =
        "Please enter a valid image URL starting with http:// or https://";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!validateProfile()) {
      setError("Please fix the highlighted fields before saving.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profile,
          bio: profile.bio.trim(),
          skills: profile.skills.trim(),
          education: profile.education.trim(),
          experience: profile.experience.trim(),
          resumeUrl: profile.resumeUrl.trim(),
          photoUrl: profile.photoUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to save your profile.");
        return;
      }

      setProfile({
        bio: data.profile?.bio ?? "",
        skills: data.profile?.skills ?? "",
        education: data.profile?.education ?? "",
        experience: data.profile?.experience ?? "",
        resumeUrl: data.profile?.resumeUrl ?? "",
        photoUrl: data.profile?.photoUrl ?? "",
      });

      setImageError(false);
      setMessage("Profile saved successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading your profile...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link
            href="/dashboard/candidate"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Candidate Profile
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Build your professional profile
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Keep your profile updated so employers can better understand
              your skills, experience, and career goals.
            </p>
          </div>

          {message && (
            <div
              role="status"
              className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              {message}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              <XCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* About You */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    About You
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Tell employers what makes you a strong candidate.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Professional Bio
                </label>

                <textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(event) =>
                    updateField("bio", event.target.value)
                  }
                  placeholder="Write a short introduction about yourself..."
                  rows={5}
                  maxLength={1000}
                  aria-invalid={Boolean(errors.bio)}
                  aria-describedby={errors.bio ? "bio-error" : undefined}
                  className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                    errors.bio
                      ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                  }`}
                />

                <div className="mt-2 flex items-center justify-between">
                  {errors.bio ? (
                    <p id="bio-error" className="text-xs text-red-600">
                      {errors.bio}
                    </p>
                  ) : (
                    <span />
                  )}

                  <p className="text-xs text-slate-400">
                    {profile.bio.length}/1000
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Skills & Experience */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Skills & Experience
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Highlight your technical and professional background.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="skills"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Skills
                  </label>

                  <textarea
                    id="skills"
                    value={profile.skills}
                    onChange={(event) =>
                      updateField("skills", event.target.value)
                    }
                    placeholder="e.g. React, Next.js, TypeScript, Python..."
                    rows={5}
                    maxLength={1000}
                    aria-invalid={Boolean(errors.skills)}
                    className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                      errors.skills
                        ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                    }`}
                  />

                  <div className="mt-2 flex justify-between">
                    {errors.skills ? (
                      <p className="text-xs text-red-600">
                        {errors.skills}
                      </p>
                    ) : (
                      <span />
                    )}

                    <p className="text-xs text-slate-400">
                      {profile.skills.length}/1000
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Experience
                  </label>

                  <textarea
                    id="experience"
                    value={profile.experience}
                    onChange={(event) =>
                      updateField("experience", event.target.value)
                    }
                    placeholder="Describe your work, internship, or project experience..."
                    rows={5}
                    maxLength={2000}
                    aria-invalid={Boolean(errors.experience)}
                    className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                      errors.experience
                        ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                    }`}
                  />

                  <div className="mt-2 flex justify-between">
                    {errors.experience ? (
                      <p className="text-xs text-red-600">
                        {errors.experience}
                      </p>
                    ) : (
                      <span />
                    )}

                    <p className="text-xs text-slate-400">
                      {profile.experience.length}/2000
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Education
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add your educational background.
                  </p>
                </div>
              </div>

              <textarea
                id="education"
                value={profile.education}
                onChange={(event) =>
                  updateField("education", event.target.value)
                }
                placeholder="e.g. Degree, institution, year, certifications..."
                rows={4}
                maxLength={1000}
                aria-invalid={Boolean(errors.education)}
                className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                  errors.education
                    ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                }`}
              />

              <div className="mt-2 flex justify-between">
                {errors.education ? (
                  <p className="text-xs text-red-600">
                    {errors.education}
                  </p>
                ) : (
                  <span />
                )}

                <p className="text-xs text-slate-400">
                  {profile.education.length}/1000
                </p>
              </div>
            </motion.div>

            {/* Professional Links */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <LinkIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Professional Links
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add your resume and profile photo.
                  </p>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Resume */}
                <div>
                  <label
                    htmlFor="resumeUrl"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Resume URL
                  </label>

                  <input
                    id="resumeUrl"
                    type="url"
                    value={profile.resumeUrl}
                    onChange={(event) =>
                      updateField("resumeUrl", event.target.value)
                    }
                    placeholder="https://your-resume-link.com"
                    aria-invalid={Boolean(errors.resumeUrl)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                      errors.resumeUrl
                        ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                    }`}
                  />

                  {errors.resumeUrl && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.resumeUrl}
                    </p>
                  )}

                  {profile.resumeUrl && !errors.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Open resume →
                    </a>
                  )}
                </div>

                {/* Photo */}
                <div>
                  <label
                    htmlFor="photoUrl"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Profile Photo URL
                  </label>

                  <input
                    id="photoUrl"
                    type="url"
                    value={profile.photoUrl}
                    onChange={(event) =>
                      updateField("photoUrl", event.target.value)
                    }
                    placeholder="https://example.com/photo.jpg"
                    aria-invalid={Boolean(errors.photoUrl)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                      errors.photoUrl
                        ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                    }`}
                  />

                  {errors.photoUrl && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.photoUrl}
                    </p>
                  )}

                  {/* Image Preview */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {profile.photoUrl &&
                      isValidUrl(profile.photoUrl) &&
                      !imageError ? (
                        <img
                          src={profile.photoUrl}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <ImageIcon className="h-7 w-7 text-slate-300" />
                      )}
                    </div>

                    <div>
                      {profile.photoUrl && imageError ? (
                        <p className="text-xs font-medium text-red-600">
                          Unable to load this image.
                        </p>
                      ) : profile.photoUrl &&
                        isValidUrl(profile.photoUrl) ? (
                        <p className="text-xs font-medium text-emerald-600">
                          Image preview available
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">
                          Your photo preview will appear here.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard/candidate"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </section>
    </main>
  );
}

