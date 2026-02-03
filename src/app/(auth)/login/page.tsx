"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (result.mustChangePassword) {
        router.push("/change-password");
        return;
      }

      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 sm:py-14">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
          
          <div className="rounded-3xl border border-orange-100/70 bg-white/20/20 backdrop-blur px-6 sm:px-8 py-7 sm:py-8 shadow-[0_24px_60px_-40px_rgba(234,88,12,0.7)]">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                StepIn
                <span className="h-2 w-2 rounded-full bg-orange-400"></span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 mb-2">
                Connexion à votre compte
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Accédez à votre espace personnel
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-orange-200/80 rounded-md shadow-sm bg-white/20/20 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 sm:text-sm"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-orange-200/80 rounded-md shadow-sm bg-white/20/20 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 sm:text-sm"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 disabled:opacity-50"
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </div>
            </form>
          </div>
          
          <div className="text-center pt-6">
            <p className="text-xs sm:text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <span className="font-medium text-gray-900">
                Accès sur invitation
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
