"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Image from "next/image";
import Footer from "../../components/Footer";
import LoaderLayout from "../../components/loader/LoaderLayout";
import Logo from "../../src/img/Propwise Logo No BG.png";

type Credentials = {
  email: string;
  password: string;
};

export default function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<Credentials>({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (credentials.password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }
    setFieldErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        return;
      }

      const errorData = await res.json().catch(() => null);
      setError(errorData?.message || "Invalid email or password.");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoaderLayout>
      <main className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#1f2937] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500 lg:grid-cols-2">
          <section className="hidden bg-gradient-to-b from-[#0b0f19] to-[#1f2937] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7ea174]">Propwise Admin</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">Welcome back to your Real Estate control center</h1>
              <p className="mt-5 text-sm text-slate-300">Manage listings, review leads, and keep your inventory current from one secure dashboard.</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-200">
              <li>Secure sign-in workflow</li>
              <li>Live listing visibility controls</li>
              <li>Inquiry and pipeline follow-up tools</li>
            </ul>
          </section>

          <section className="p-7 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f2937]">Propwise</p>
                <h2 className="text-3xl font-bold text-slate-900">Admin Login</h2>
              </div>
              <Image src={Logo} width={48} height={48} alt="Propwise logo" />
              {/* <Link href="/" className="rounded-lg border border-[#1f2937]/40 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#7ea174]/10">
                Listings
              </Link> */}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCredentials((prev) => ({ ...prev, email: value }));
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  required
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ring-[#7ea174] transition focus:ring-2 ${fieldErrors.email ? "border-rose-300 focus:border-rose-400" : "border-slate-300 focus:border-[#7ea174]"}`}
                  placeholder="admin@propwise.lk"
                />
                {fieldErrors.email ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCredentials((prev) => ({ ...prev, password: value }));
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  required
                  className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ring-[#7ea174] transition focus:ring-2 ${fieldErrors.password ? "border-rose-300 focus:border-rose-400" : "border-slate-300 focus:border-[#7ea174]"}`}
                  placeholder="Enter your password"
                />
                {fieldErrors.password ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.password}</p> : null}
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 rounded border-slate-300" />
                Remember me
              </label>

              {error ? (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1f2937] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7ea174] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <Link href="/" className="block w-full rounded-lg border border-[#1f2937]/40 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-[#7ea174]/10">
                Back to Listings
              </Link>
            </form>
          </section>
        </div>
      </div>
      <Footer />
      </main>
    </LoaderLayout>
  );
}


