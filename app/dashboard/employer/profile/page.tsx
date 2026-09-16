"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  MapPin,
  Save,
  Upload,
} from "lucide-react";

type Profile = {
  companyName: string;
  logoUrl: string;
  description: string;
  website: string;
  location: string;
};

const emptyProfile: Profile = {
  companyName: "",
  logoUrl: "",
  description: "",
  website: "",
  location: "",
};

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/employer/profile");

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load company profile.");
          return;
        }

        if (data.profile) {
          setProfile({
            companyName: data.profile.companyName || "",
            logoUrl: data.profile.logoUrl || "",
            description: data.profile.description || "",
            website: data.profile.website || "",
            location: data.profile.location || "",
          });
        }
      } catch {
        setError("Unable to load company profile. Please try again.");
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

    setError("");
    setSuccess("");

    if (field === "logoUrl") {
      setLogoError(false);
    }
  }

  function validateForm() {
    if (profile.companyName.trim().length < 2) {
      return "Company name must be at least 2 characters.";
    }

    if (profile.companyName.trim().length > 150) {
      return "Company name must be less than 150 characters.";
    }

    if (profile.description.length > 2000) {
      return "Description must be less than 2000 characters.";
    }

    if (profile.location.length > 150) {
      return "Location must be less than 150 characters.";
    }

    if (profile.logoUrl.trim()) {
      try {
        new URL(profile.logoUrl.trim());
      } catch {
        return "Please enter a valid logo URL.";
      }
    }

    if (profile.website.trim()) {
      try {
        new URL(profile.website.trim());
      } catch {
        return "Please enter a valid website URL.";
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

      const response = await fetch("/api/employer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: profile.companyName.trim(),
          logoUrl: profile.logoUrl.trim(),
          description: profile.description.trim(),
          website: profile.website.trim(),
          location: profile.location.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to save your profile.");
        return;
      }

      setSuccess("Company profile saved successfully.");

      if (data.profile) {
        setProfile({
          companyName: data.profile.companyName || "",
          logoUrl: data.profile.logoUrl || "",
          description: data.profile.description || "",
          website: data.profile.website || "",
          location: data.profile.location || "",
        });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading company profile...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/dashboard/employer"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employer Dashboard
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
            <Building2 className="h-4 w-4" />
            Employer Profile
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Company Profile
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Create a professional company profile that helps candidates
            understand your organization.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
          >
            {/* Alerts */}
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {success}
              </div>
            )}

            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Company Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="companyName"
                  type="text"
                  value={profile.companyName}
                  onChange={(event) =>
                    updateField("companyName", event.target.value)
                  }
                  placeholder="e.g. CareerHub Technologies"
                  maxLength={150}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                <div className="mt-1 text-right text-xs text-slate-400">
                  {profile.companyName.length}/150
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label
                  htmlFor="logoUrl"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Company Logo URL
                </label>

                <div className="relative">
                  <Upload className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="logoUrl"
                    type="url"
                    value={profile.logoUrl}
                    onChange={(event) =>
                      updateField("logoUrl", event.target.value)
                    }
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Add a publicly accessible image URL for your company logo.
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Company Description
                </label>

                <textarea
                  id="description"
                  value={profile.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Tell candidates about your company, culture, mission, and what you do..."
                  maxLength={2000}
                  rows={7}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                <div className="mt-1 text-right text-xs text-slate-400">
                  {profile.description.length}/2000
                </div>
              </div>

              {/* Website + Location */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="website"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Company Website
                  </label>

                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="website"
                      type="url"
                      value={profile.website}
                      onChange={(event) =>
                        updateField("website", event.target.value)
                      }
                      placeholder="https://company.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Location
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="location"
                      type="text"
                      value={profile.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      placeholder="e.g. Karachi, Pakistan"
                      maxLength={150}
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Save */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/dashboard/employer"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
            </div>
          </motion.form>

          {/* Preview */}
          <motion.aside
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Company Preview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This is how your company identity starts to look to candidates.
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {profile.logoUrl && !logoError ? (
                    <img
                      src={profile.logoUrl}
                      alt={`${profile.companyName || "Company"} logo`}
                      className="h-full w-full object-contain"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <Building2 className="h-7 w-7 text-indigo-500" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-bold text-slate-900">
                    {profile.companyName || "Your Company"}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{profile.location || "Location not added"}</span>
                  </div>
                </div>
              </div>

              <p className="line-clamp-5 text-sm leading-6 text-slate-600">
                {profile.description ||
                  "Your company description will appear here once you add it."}
              </p>

              {profile.website && (
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-600">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="truncate">{profile.website}</span>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-xl bg-indigo-50 p-4">
              <p className="text-sm font-medium text-indigo-900">
                💡 Profile tip
              </p>
              <p className="mt-1 text-xs leading-5 text-indigo-700">
                A clear company description and website can help candidates
                better understand your organization before applying.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}