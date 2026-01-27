"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getServiceUrl } from "@/config/api.config";

interface School {
  id: string;
  name: string;
}

interface ImportResult {
  createdCount: number;
  errors: string[];
}

export default function AdminStudentImportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolId, setSchoolId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);

  const campaignBase = getServiceUrl("campaign");
  const authBase = getServiceUrl("auth");

  useEffect(() => {
    if (!user || user.role !== "platform_admin") {
      router.push("/");
      return;
    }
    loadSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadSchools = async () => {
    try {
      const res = await fetch(`${campaignBase}/admin/schools`);
      const data = await res.json().catch(() => []);
      setSchools(Array.isArray(data) ? data : []);
    } catch {
      setSchools([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !schoolId) return;
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `${authBase}/admin/students/import?schoolId=${schoolId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: formData,
        }
      );
      const data = await res.json().catch(() => null);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Import étudiants
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              École
            </label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-800 rounded-lg dark:bg-slate-950 dark:text-gray-100"
              required
            >
              <option value="">Sélectionner</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Fichier CSV ou Excel
            </label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Colonnes requises : <strong>email</strong> et{" "}
              <strong>student_number</strong>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Import..." : "Importer"}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
            <p className="text-gray-900 dark:text-gray-100 font-medium">
              Comptes créés : {result.createdCount}
            </p>
            {result.errors?.length > 0 && (
              <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                <p className="font-medium mb-2">Erreurs :</p>
                <ul className="list-disc pl-5 space-y-1">
                  {result.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
