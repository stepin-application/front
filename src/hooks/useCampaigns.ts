import { useState, useCallback } from 'react';
import { campaigns, invitations } from '@/lib/api';
import { handleApiError } from '@/lib/errorHandler';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  deadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lockedAt?: string;
}

interface CreateCampaignData {
  schoolId: string;
  name: string;
  description: string;
  deadline: string;
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

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campaigns.getAll();
      setCampaignsList(data || []);
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
      setCampaignsList(data || []);
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

      const deadlineDate = new Date(data.deadline);
      if (deadlineDate <= new Date()) {
        throw new Error('La deadline doit être dans le futur');
      }

      const campaign = await campaigns.create(data);
      toast.success('Campagne créée avec succès');
      return campaign;
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
      return campaign;
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
      }

      const campaign = await campaigns.update(id, data);
      toast.success('Campagne mise à jour');
      return campaign;
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
