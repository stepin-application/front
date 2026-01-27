"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getServiceUrl } from "@/config/api.config";

interface Company {
  id: string;
  name: string;
}

export default function AdminCompaniesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const campaignBase = getServiceUrl("campaign");

  useEffect(() => {
    if (!user || user.role !== "platform_admin") {
      router.push("/");
      return;
    }
    loadCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCompanies = async () => {
    try {
      const res = await fetch(`${campaignBase}/admin/companies`);
      const data = await res.json().catch(() => []);
      setCompanies(Array.isArray(data) ? data : []);
    } catch {
      setCompanies([]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await fetch(`${campaignBase}/admin/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      setName("");
      loadCompanies();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingId(company.id);
    setEditingName(company.name);
  };

  const handleUpdate = async () => {
    if (!editingId || !editingName.trim()) return;
    setLoading(true);
    try {
      await fetch(`${campaignBase}/admin/companies/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ name: editingName.trim() }),
      });
      setEditingId(null);
      setEditingName("");
      loadCompanies();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (companyId: string) => {
    if (!confirm("Supprimer cette entreprise ?")) return;
    setLoading(true);
    try {
      await fetch(`${campaignBase}/admin/companies/${companyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      loadCompanies();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Gestion des entreprises
        </h1>

        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-3"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de l'entreprise"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-800 rounded-lg dark:bg-slate-950 dark:text-gray-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer"}
          </button>
        </form>

        <div className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
          {companies.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              Aucune entreprise pour le moment.
            </p>
          ) : (
            <ul className="space-y-2">
              {companies.map((company) => (
                <li
                  key={company.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-slate-800 pb-2"
                >
                  <div className="flex-1">
                    <span className="text-gray-900 dark:text-gray-100">
                      {company.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(company)}
                      className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-slate-700"
                    >
                      Éditer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(company.id)}
                      className="px-3 py-1 text-sm rounded-md bg-red-600 text-white"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {editingId && (
          <div className="mt-6 bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Modifier l'entreprise
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-800 rounded-lg dark:bg-slate-950 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setEditingName("");
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
