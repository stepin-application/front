"use client"

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getServiceUrl } from "@/config/api.config";
import { useAuth } from "@/contexts/AuthContext";

interface Participant {
  companyId: string;
  campaignId: string;
  status: string;
  respondedAt?: string;
}

interface Company {
  id: string;
  name: string;
}

export default function ParticipantsPage() {
  const { id: pathId } = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || (pathId as string);
  const router = useRouter();
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignTitle, setCampaignTitle] = useState('');
  const campaignBase = getServiceUrl("campaign");
  const [companyMap, setCompanyMap] = useState<Record<string, Company>>({});

  useEffect(() => {
    if (!user || user.role !== 'school') {
      router.push('/');
      return;
    }
    fetchParticipants();
  }, [id, user, router]);

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`${campaignBase}/campaigns/${id}/participants`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json().catch(() => []);
      setParticipants(Array.isArray(data) ? data : []);
      setCampaignTitle('');

      const companiesRes = await fetch(`${campaignBase}/admin/companies`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const companies = await companiesRes.json().catch(() => []);
      if (Array.isArray(companies)) {
        const map: Record<string, Company> = {};
        companies.forEach((c: any) => {
          if (c?.id) map[c.id] = c;
        });
        setCompanyMap(map);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/campaigns/school/me" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à la campagne
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Entreprises Participantes</h1>
          <p className="text-gray-600">{campaignTitle}</p>
          <p className="text-sm text-gray-500 mt-2">
            {participants.length} entreprise{participants.length > 1 ? 's' : ''} participante{participants.length > 1 ? 's' : ''}
          </p>
        </div>

        {participants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise participante</h3>
            <p className="text-gray-600">Les entreprises qui acceptent l'invitation apparaîtront ici</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {participants.map((participant) => {
              const company = companyMap[participant.companyId];
              const companyName = company?.name || participant.companyId || 'Entreprise';
              const companyInitial = companyName?.[0] || '?';
              return (
              <div key={participant.companyId} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{companyInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{companyName}</h3>
                    <p className="text-sm text-gray-600">{participant.status}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {participant.respondedAt
                        ? `Répondu le ${new Date(participant.respondedAt).toLocaleDateString('fr-FR')}`
                        : 'En attente de réponse'}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-green-800 font-medium">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Participation enregistrée
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
