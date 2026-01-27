"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminHomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "platform_admin") {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Administration
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/schools"
            className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Écoles
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Créer et gérer les écoles.
            </p>
          </Link>
          <Link
            href="/admin/companies"
            className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Entreprises
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Créer et gérer les entreprises partenaires.
            </p>
          </Link>
          <Link
            href="/admin/users"
            className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Utilisateurs staff
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Créer des comptes école/entreprise.
            </p>
          </Link>
          <Link
            href="/admin/students/import"
            className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Import étudiants
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Import Excel/CSV avec mot de passe temporaire.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
