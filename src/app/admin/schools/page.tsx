"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getServiceUrl } from "@/config/api.config";

interface School {
  id: string;
  name: string;
}

export default function AdminSchoolsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await fetch(`${campaignBase}/admin/schools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      setName("");
      loadSchools();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (school: School) => {
    setEditingId(school.id);
    setEditingName(school.name);
  };

  const handleUpdate = async () => {
    if (!editingId || !editingName.trim()) return;
    setLoading(true);
    try {
      await fetch(`${campaignBase}/admin/schools/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ name: editingName.trim() }),
      });
      setEditingId(null);
      setEditingName("");
      loadSchools();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (schoolId: string) => {
    if (!confirm("Supprimer cette école ?")) return;
    setLoading(true);
    try {
      await fetch(`${campaignBase}/admin/schools/${schoolId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      loadSchools();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Gestion des écoles
        </h1>

        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-3"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de l'école"
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
          {schools.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              Aucune école pour le moment.
            </p>
          ) : (
            <ul className="space-y-2">
              {schools.map((school) => (
                <li
                  key={school.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-slate-800 pb-2"
                >
                  <div className="flex-1">
                    <span className="text-gray-900 dark:text-gray-100">
                      {school.name}
                    </span>
                    <div className="text-xs text-gray-500">{school.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(school)}
                      className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-slate-700"
                    >
                      Éditer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(school.id)}
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
              Modifier l'école
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
