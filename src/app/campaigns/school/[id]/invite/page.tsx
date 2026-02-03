"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, CheckCircle2, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { campaigns, directory, invitations } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Company {
  id: string;
  name: string;
}

interface Invitation {
  id: string;
  companyId: string;
  status?: string;
}

export default function SchoolCampaignInvitePage() {
  const { id: pathId } = useParams();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id") || (pathId as string);
  const router = useRouter();
  const { user } = useAuth();

  const [campaignName, setCampaignName] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "school") {
      router.push("/");
      return;
    }
    if (!campaignId) {
      toast.error("Campagne introuvable.");
      router.push("/campaigns/school/me");
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        const [companiesRes, invitationsRes, campaignRes] = await Promise.all([
          directory.getCompanies(),
          invitations.listByCampaign(campaignId),
          campaigns.getById(campaignId),
        ]);

        setCompanies(Array.isArray(companiesRes) ? companiesRes : []);

        const invited = Array.isArray(invitationsRes)
          ? invitationsRes.map((inv: Invitation) => inv.companyId).filter(Boolean)
          : [];
        setInvitedIds(new Set(invited));
        setCampaignName(campaignRes?.name || campaignRes?.title || "Campagne");
      } catch (error) {
        console.error("Error loading invitations page:", error);
        toast.error("Impossible de charger les entreprises.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, router, campaignId]);

  const filteredCompanies = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return companies;
    return companies.filter((company) =>
      company.name.toLowerCase().includes(value),
    );
  }, [companies, search]);

  const toggleSelect = (companyId: string) => {
    if (invitedIds.has(companyId)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredCompanies.forEach((company) => {
        if (!invitedIds.has(company.id)) {
          next.add(company.id);
        }
      });
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleInvite = async () => {
    if (selectedIds.size === 0) {
      toast.error("Sélectionnez au moins une entreprise.");
      return;
    }
    setSubmitting(true);
    const ids = Array.from(selectedIds);
    const results = await Promise.allSettled(
      ids.map((companyId) => invitations.create(campaignId, companyId)),
    );
    const successIds: string[] = [];
    let failures = 0;
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successIds.push(ids[index]);
      } else {
        failures += 1;
      }
    });

    if (successIds.length > 0) {
      toast.success(`${successIds.length} invitation(s) envoyée(s).`);
      setInvitedIds((prev) => new Set([...prev, ...successIds]));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        successIds.forEach((id) => next.delete(id));
        return next;
      });
    }
    if (failures > 0) {
      toast.error(`${failures} invitation(s) en échec.`);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <Link
          href="/campaigns/school/me"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à mes campagnes
        </Link>

        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Inviter des entreprises
            </h1>
            <p className="text-sm text-gray-600">
              Campagne : <span className="font-medium">{campaignName}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une entreprise..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={selectAllFiltered}>
                Tout sélectionner
              </Button>
              <Button variant="outline" type="button" onClick={clearSelection}>
                Effacer
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          {filteredCompanies.length === 0 ? (
            <div className="py-12 text-center text-gray-600">
              Aucune entreprise trouvée.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCompanies.map((company) => {
                const invited = invitedIds.has(company.id);
                const selected = selectedIds.has(company.id);
                return (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => toggleSelect(company.id)}
                    className={`flex items-center justify-between border rounded-lg p-3 text-left transition ${
                      invited
                        ? "border-gray-200 bg-transparent cursor-not-allowed"
                        : selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    disabled={invited}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {company.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {company.id}
                        </p>
                      </div>
                    </div>
                    {invited ? (
                      <Badge variant="outline" className="text-xs">
                        Déjà invitée
                      </Badge>
                    ) : selected ? (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            {selectedIds.size} sélectionnée(s) • {invitedIds.size} déjà invitées
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleInvite}
              disabled={submitting || selectedIds.size === 0}
            >
              {submitting ? "Envoi..." : "Envoyer les invitations"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/campaigns/school/me")}
            >
              Terminer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
