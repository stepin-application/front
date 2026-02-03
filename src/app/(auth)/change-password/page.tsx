"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getServiceUrl } from "@/config/api.config";
import { useAuth } from "@/contexts/AuthContext";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authBase = getServiceUrl("auth");
  const email = useMemo(() => {
    if (typeof window === "undefined") {
      return user?.email || "";
    }
    if (user?.email) return user.email;
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed?.email || "";
      } catch {
        return "";
      }
    }
    return "";
  }, [user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email) {
        throw new Error("Utilisateur non identifié. Reconnectez-vous.");
      }
      if (currentPassword === newPassword) {
        throw new Error("Le nouveau mot de passe doit être différent de l'actuel.");
      }
      const res = await fetch(`${authBase}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Erreur de changement de mot de passe");
      }

      localStorage.setItem("mustChangePassword", "false");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erreur de changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gray-50">
      <div className="w-full max-w-md mx-auto px-4 bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Changer le mot de passe
        </h1>
        <p className="text-gray-600 mb-6">
          Votre mot de passe temporaire doit être modifié.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
              {email || "Utilisateur non identifié"}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Mot de passe actuel
            </label>
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      </div>
    </div>
  );
}
