
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Mail,
  MapPin,
} from "lucide-react";

const platformLinks = [
  { label: "Find Jobs", href: "#jobs" },
  { label: "Categories", href: "#categories" },
  { label: "For Employers", href: "#employers" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Create Account", href: "/register" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200">
                <BriefcaseBusiness size={19} />
              </span>

              <span className="text-xl font-bold tracking-tight text-slate-900">
                Career<span className="text-indigo-600">Hub</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Connecting talented people with meaningful opportunities
              and helping employers find the right talent.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Built for modern careers
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Account
            </h3>

            <ul className="mt-5 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    {link.label}
                    {link.label === "Create Account" && (
                      <ArrowUpRight size={13} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Get in touch
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />

                <span className="text-sm text-slate-500">
                  hello@careerhub.com
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />

                <span className="text-sm text-slate-500">
                  Pakistan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CareerHub. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-slate-400">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Secure Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

