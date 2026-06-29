"use client";

import { adminLogin } from "@/src/actions/authActions";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#26160C] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-[#DA944B] p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white">Kitchen Access</h1>
          <p className="text-orange-100 font-medium text-sm">
            Staff Authorized Personnel Only
          </p>
        </div>

        <div className="p-8 pt-10">
          <form action={adminLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Enter Access PIN
              </label>
              <input
                name="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="****"
                required
                className="w-full text-center text-4xl tracking-[1em] font-black text-[#653100] py-4 border-b-2 border-gray-200 focus:border-[#DA944B] focus:outline-none placeholder:tracking-widest"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg animate-pulse">
                Access Denied: {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#653100] hover:bg-[#4a2400] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              Unlock Dashboard
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-[#DA944B] transition-colors"
            >
              Back to Main Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  );
}
