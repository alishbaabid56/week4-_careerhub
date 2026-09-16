"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  LogOut,
  Menu,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "Categories", href: "/categories" },
 { label: "For Employers", href: "/dashboard/employer" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const user = session?.user;

  const role = (user as { role?: string } | undefined)?.role;

  const dashboardHref =
    role === "employer"
      ? "/dashboard/employer"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/candidate";

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await authClient.signOut();
      closeMenu();
      window.location.href = "/";
    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              onClick={closeMenu}
              className="group flex items-center gap-2.5"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200"
              >
                <BriefcaseBusiness size={19} />
              </motion.div>

              <span className="text-xl font-bold tracking-tight text-slate-900">
                Career<span className="text-indigo-600">Hub</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
              >
                <Link
                  href={link.href}
                  className="group relative text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
                >
                  {link.label}

                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-indigo-600 transition-all duration-200 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop actions */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden items-center gap-3 md:flex"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#jobs"
                aria-label="Search jobs"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
              >
                <Search size={18} />
              </Link>
            </motion.div>

            {isPending ? (
              <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
            ) : user ? (
              <>
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>

                  <span className="max-w-28 truncate">
                    {user.name || "Profile"}
                  </span>
                </Link>

                <motion.button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut size={16} />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-1 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
                >
                  Login
                </Link>

                <motion.div
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
                  >
                    <UserPlus size={16} />

                    <span>Get Started</span>

                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            type="button"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((previous) => !previous)}
            whileTap={{ scale: 0.9 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMenuOpen ? "close" : "menu"}
                initial={{
                  opacity: 0,
                  rotate: -45,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotate: 45,
                  scale: 0.7,
                }}
                transition={{ duration: 0.15 }}
              >
                {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="overflow-hidden md:hidden"
            >
              <nav className="border-t border-slate-200/80 py-4">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.06,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
                      >
                        {link.label}
                        <ArrowRight size={15} className="text-slate-400" />
                      </Link>
                    </motion.div>
                  ))}

                  <div className="mt-2 border-t border-slate-100 pt-3">
                    {isPending ? (
                      <div className="mx-3 h-10 animate-pulse rounded-lg bg-slate-100" />
                    ) : user ? (
                      <div className="space-y-2">
                        <Link
                          href={dashboardHref}
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </span>

                          <span className="truncate">
                            {user.name || "Profile"}
                          </span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                        >
                          <LogOut size={16} />
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link
                          href="/login"
                          onClick={closeMenu}
                          className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                        >
                          Login
                        </Link>

                        <Link
                          href="/register"
                          onClick={closeMenu}
                          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                          <UserPlus size={16} />
                          Get Started
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}