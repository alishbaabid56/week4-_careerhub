"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Search } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string | null;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();
        setCategories(data.categories ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      category.name.toLowerCase().includes(query) ||
      category.description?.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-indigo-50/70 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <BriefcaseBusiness size={28} />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Explore Job Categories
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Browse opportunities by category and find roles that match your
              skills and career goals.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mx-auto mb-10 max-w-xl">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-sm text-slate-500">
            Loading categories...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredCategories.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-16 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No categories found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term.
            </p>
          </div>
        )}

        {/* Categories */}
        {!loading && !error && filteredCategories.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/jobs?categoryId=${category.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                  />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-slate-900">
                  {category.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {category.description || "Explore jobs in this category."}
                </p>

                <p className="mt-5 text-sm font-semibold text-indigo-600">
                  View jobs →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}