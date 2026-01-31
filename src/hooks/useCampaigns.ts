import { useState, useCallback } from 'react';
import { campaigns, invitations, directory } from '@/lib/api';
import { handleApiError } from '@/lib/errorHandler';
import { toast } from 'sonner';
import { Campaign } from '@/types/campaign';

interface CreateCampaignData {
  schoolId: string;
  name: string;
  description: string;
  deadline: string;
  startDate: string;
}

interface UseCampaignsReturn {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  createCampaign: (data: CreateCampaignData) => Promise<Campaign | null>;
  getCampaign: (id: string) => Promise<Campaign | null>;
  updateCampaign: (id: string, data: Partial<CreateCampaignData>) => Promise<Campaign | null>;
  deleteCampaign: (id: string) => Promise<boolean>;
  lockCampaign: (id: string) => Promise<boolean>;
  loadCampaigns: () => Promise<void>;
  loadActiveCampaigns: () => Promise<void>;
  inviteCompany: (campaignId: string, companyId: string) => Promise<boolean>;
  acceptInvitation: (campaignId: string, companyId: string) => Promise<boolean>;
  refuseInvitation: (campaignId: string, companyId: string) => Promise<boolean>;
}

export function useCampaigns(): UseCampaignsReturn {
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSchoolsMap = async (): Promise<Record<string, string>> => {
    try {
      const data = await directory.getSchools();
      if (!Array.isArray(data)) return {};
      return data.reduce((acc: Record<string, string>, school: any) => {
        if (school?.id) acc[school.id] = school.name || 'École partenaire';
        return acc;
      }, {});
    } catch {
      return {};
    }
  };

  const mapCampaign = (campaign: any, schoolsMap: Record<string, string>): Campaign => {
    const schoolId = campaign?.schoolId || '';
    const deriveStatus = () => {
      const rawStatus = (campaign?.status || '').toString().toUpperCase();
      if (rawStatus === 'ACTIVE' || rawStatus === 'UPCOMING' || rawStatus === 'CLOSED') {
        return rawStatus.toLowerCase();
      }

      const deadline = campaign?.deadline ? new Date(campaign.deadline) : null;
      const startDate = campaign?.startDate ? new Date(campaign.startDate) : null;
      const now = Date.now();

      if (rawStatus === 'LOCKED') {
        return 'closed';
      }
      if (deadline && !Number.isNaN(deadline.getTime()) && deadline.getTime() < now) {
        return 'closed';
      }
      if (startDate && !Number.isNaN(startDate.getTime()) && startDate.getTime() > now) {
        return 'upcoming';
      }
      return 'active';
    };

    return {
      id: campaign?.id,
      title: campaign?.name ?? campaign?.title ?? 'Campagne',
      description: campaign?.description ?? '',
      companyDeadline: campaign?.deadline ?? '',
      studentDeadline: campaign?.deadline ?? '',
      startDate: campaign?.startDate ?? campaign?.createdAt ?? '',
      endDate: campaign?.deadline ?? '',
      location: campaign?.location ?? '—',
      status: deriveStatus(),
      maxParticipants: campaign?.maxParticipants ?? undefined,
      participants: campaign?.participants ?? 0,
      type: 'school',
      target: campaign?.target ?? 'students',
      createdBy: {
        id: schoolId,
        name: schoolsMap[schoolId] || 'École partenaire',
        logo: ''
      },
      invitedCompanyEmails: [],
      respondedCompanies: [],
      tags: Array.isArray(campaign?.tags) ? campaign.tags : [],
      requirements: Array.isArray(campaign?.requirements) ? campaign.requirements : [],
      benefits: Array.isArray(campaign?.benefits) ? campaign.benefits : [],
      image: campaign?.image,
      createdAt: campaign?.createdAt,
      updatedAt: campaign?.updatedAt
    };
  };

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaigns.getAll();
      const schoolsMap = await loadSchoolsMap();
      const list = Array.isArray(data) ? data.map((c) => mapCampaign(c, schoolsMap)) : [];
      setCampaignsList(list);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(errorMessage);
      handleApiError(err);
      setCampaignsList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadActiveCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaigns.getActiveCampaigns();
      const schoolsMap = await loadSchoolsMap();
      const list = Array.isArray(data) ? data.map((c) => mapCampaign(c, schoolsMap)) : [];
      setCampaignsList(list);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(errorMessage);
      handleApiError(err);
      setCampaignsList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = useCallback(async (data: CreateCampaignData): Promise<Campaign | null> => {
    try {
      setLoading(true);
      setError(null);

      // Validation
      if (!data.name || data.name.trim().length < 3) {
        throw new Error('Le titre doit contenir au moins 3 caractères');
      }
      if (!data.description || data.description.trim().length < 10) {
        throw new Error('La description doit contenir au moins 10 caractères');
      }
      if (!data.deadline) {
        throw new Error('La deadline est requise');
      }
      if (!data.startDate) {
        throw new Error('La date de debut est requise');
      }
      const deadlineDate = new Date(data.deadline);
      const startDate = new Date(data.startDate);
      if (deadlineDate <= new Date()) {
        throw new Error('La deadline doit être dans le futur');
      }

      const campaign = await campaigns.create(data);
      const schoolsMap = await loadSchoolsMap();
      toast.success('Campagne créée avec succès');
      return mapCampaign(campaign, schoolsMap);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCampaign = useCallback(async (id: string): Promise<Campaign | null> => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        throw new Error('ID de campagne requis');
      }

      const campaign = await campaigns.getById(id);
      const schoolsMap = await loadSchoolsMap();
      return mapCampaign(campaign, schoolsMap);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(errorMessage);
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCampaign = useCallback(async (
    id: string,
    data: Partial<CreateCampaignData>
  ): Promise<Campaign | null> => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        throw new Error('ID de campagne requis');
      }

      // Validation des champs fournis
      if (data.name !== undefined && data.name.trim().length < 3) {
        throw new Error('Le titre doit contenir au moins 3 caractères');
      }
      if (data.description !== undefined && data.description.trim().length < 10) {
        throw new Error('La description doit contenir au moins 10 caractères');
      }
      if (data.deadline !== undefined) {
        const deadlineDate = new Date(data.deadline);
        if (deadlineDate <= new Date()) {
          throw new Error('La deadline doit être dans le futur');
        }
        if (data.startDate !== undefined) {
          const startDate = new Date(data.startDate);
          if (deadlineDate < startDate) {
            throw new Error('La deadline doit être après la date de début');
          }
        }
      }

      const campaign = await campaigns.update(id, data);
      const schoolsMap = await loadSchoolsMap();
      toast.success('Campagne mise à jour');
      return mapCampaign(campaign, schoolsMap);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de mise à jour';
      setError(errorMessage);
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCampaign = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        throw new Error('ID de campagne requis');
      }

      await campaigns.delete(id);
      toast.success('Campagne supprimée');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de suppression';
      setError(errorMessage);
      handleApiError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const lockCampaign = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        throw new Error('ID de campagne requis');
      }

      await campaigns.lock(id);
      toast.success('Campagne verrouillée');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de verrouillage';
      setError(errorMessage);
      handleApiError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const inviteCompany = useCallback(async (
    campaignId: string,
    companyId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (!campaignId || !companyId) {
        throw new Error('IDs de campagne et entreprise requis');
      }

      await invitations.create(campaignId, companyId);
      toast.success('Invitation envoyée');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'invitation";
      setError(errorMessage);
      handleApiError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptInvitation = useCallback(async (
    campaignId: string,
    companyId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (!campaignId || !companyId) {
        throw new Error('IDs de campagne et entreprise requis');
      }

      await invitations.accept(campaignId, companyId);
      toast.success('Invitation acceptée');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur d'acceptation";
      setError(errorMessage);
      handleApiError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refuseInvitation = useCallback(async (
    campaignId: string,
    companyId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (!campaignId || !companyId) {
        throw new Error('IDs de campagne et entreprise requis');
      }

      await invitations.refuse(campaignId, companyId);
      toast.success('Invitation refusée');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de refus';
      setError(errorMessage);
      handleApiError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    campaigns: campaignsList,
    loading,
    error,
    createCampaign,
    getCampaign,
    updateCampaign,
    deleteCampaign,
    lockCampaign,
    loadCampaigns,
    loadActiveCampaigns,
    inviteCompany,
    acceptInvitation,
    refuseInvitation,
  };
}
