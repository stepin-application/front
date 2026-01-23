"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Building, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Participant {
  company: {
    id: string;
    name: string;
    logo: string;
    industry: string;
  };
  acceptedAt: string;
  jobOpeningsCount: number;
  jobOpenings: Array<{
    id: string;
    title: string;
    contractType: string;
  }>;
}

export default function ParticipantsPage() {
  const { id } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignTitle, setCampaignTitle] = useState('');

  useEffect(() => {
    fetchParticipants();
  }, [id]);

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/campaigns/${id}/participants`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setParticipants(data.participants);
      setCampaignTitle(data.campaignTitle);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href={`/campaigns/${id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
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
            {participants.map((participant) => (
              <div key={participant.company.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={participant.company.logo} />
                    <AvatarFallback>{participant.company.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{participant.company.name}</h3>
                    <p className="text-sm text-gray-600">{participant.company.industry}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Accepté le {new Date(participant.acceptedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-green-800 font-medium">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    {participant.jobOpeningsCount} poste{participant.jobOpeningsCount > 1 ? 's' : ''} proposé{participant.jobOpeningsCount > 1 ? 's' : ''}
                  </p>
                </div>

                {participant.jobOpenings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Postes :</p>
                    {participant.jobOpenings.map((job) => (
                      <div key={job.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">{job.title}</span>
                        <Badge variant="outline" className="text-xs">{job.contractType}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
