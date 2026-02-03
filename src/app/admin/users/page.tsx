"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getServiceUrl } from "@/config/api.config";

interface School {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
}

type StaffRole = "SCHOOL_STAFF" | "COMPANY_USER";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("SCHOOL_STAFF");
  const [schoolId, setSchoolId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [schoolStaffRole, setSchoolStaffRole] = useState("STAFF");
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const campaignBase = getServiceUrl("campaign");
  const authBase = getServiceUrl("auth");

  useEffect(() => {
    if (!user || user.role !== "platform_admin") {
      router.push("/");
      return;
    }
    loadRefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadRefs = async () => {
    try {
      const [schoolsRes, companiesRes] = await Promise.all([
        fetch(`${campaignBase}/admin/schools`),
        fetch(`${campaignBase}/admin/companies`),
      ]);
      const schoolsData = await schoolsRes.json().catch(() => []);
      const companiesData = await companiesRes.json().catch(() => []);
      setSchools(Array.isArray(schoolsData) ? schoolsData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
    } catch {
      setSchools([]);
      setCompanies([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const payload: any = {
        email,
        password,
        role,
        mustChangePassword,
      };

      if (role === "SCHOOL_STAFF") {
        payload.schoolId = schoolId || undefined;
        payload.schoolStaffRole = schoolStaffRole;
      }
      if (role === "COMPANY_USER") {
        payload.companyId = companyId || undefined;
      }

      await fetch(`${authBase}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Création de comptes staff
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-800 rounded-lg dark:bg-slate-950 dark:text-gray-100"
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Mot de passe temporaire
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-800 rounded-lg dark:bg-slate-950 dark:text-gray-100"
              type="text"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Rôle
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-800 rounded-lg dark:bg-slate-950 dark:text-gray-100"
            >
              <option value="SCHOOL_STAFF">École (staff)</option>
              <option value="COMPANY_USER">Entreprise (staff)</option>
            </select>
          </div>

          {role === "SCHOOL_STAFF" && (
            <>
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
                  Rôle école
                </label>
                <select
                  value={schoolStaffRole}
                  onChange={(e) => setSchoolStaffRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-800 rounded-lg dark:bg-slate-950 dark:text-gray-100"
                >
                  <option value="STAFF">Staff</option>
                  <option value="SCHOOL_ADMIN">Admin école</option>
                </select>
              </div>
            </>
          )}

          {role === "COMPANY_USER" && (
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Entreprise
              </label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-800 rounded-lg dark:bg-slate-950 dark:text-gray-100"
                required
              >
                <option value="">Sélectionner</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              id="mustChangePassword"
              type="checkbox"
              checked={mustChangePassword}
              onChange={(e) => setMustChangePassword(e.target.checked)}
            />
            <label htmlFor="mustChangePassword" className="text-sm text-gray-700 dark:text-gray-300">
              Changement de mot de passe obligatoire
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
