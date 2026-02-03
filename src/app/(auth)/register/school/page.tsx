"use client";

import Link from "next/link";

export default function SchoolRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-transparent">
      <div className="w-full max-w-md mx-auto px-4 text-center bg-white/20 rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Inscription désactivée
        </h1>
        <p className="text-gray-600 mb-6">
          Les comptes école sont créés par un administrateur de la plateforme.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
