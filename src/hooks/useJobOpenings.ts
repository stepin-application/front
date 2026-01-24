import { useState, useCallback } from 'react';
import { jobOpenings } from '@/lib/api';
import { handleApiError } from '@/lib/errorHandler';
import { toast } from 'sonner';

interface JobOpening {
  id: string;
  campaignId: string;
  companyId: string;
  title: string;
  description: string;
  requirements?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateJobOpeningData {
  title: string;
  description: string;
  requirements?: string;
}

interface UseJobOpeningsReturn {
  jobOpeningsList: JobOpening[];
  loading: boolean;
  error: string | null;
  createJobOpening: (campaignId: string, companyId: string, data: CreateJobOpeningData) => Promise<JobOpening | null>;
  updateJobOpening: (campaignId: string, companyId: string, jobId: string, data: Partial<CreateJobOpeningData>) => Promise<JobOpening | null>;
  deleteJobOpening: (campaignId: string, companyId: string, jobId: string) => Promise<boolean>;
  loadJobOpenings: (campaignId: string, companyId: string) => Promise<void>;
}

export function useJobOpenings(): UseJobOpeningsReturn {
  const [jobOpeningsList, setJobOpeningsList] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobOpenings = useCallback(async (campaignId: string, companyId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!campaignId || !companyId) {
        throw new Error('IDs de campagne et entreprise requis');
      }

      const data = await jobOpenings.getAll({ campaignId, companyId });
      setJobOpeningsList(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(errorMessage);
      handleApiError(err);
      setJobOpeningsList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createJobOpening = useCallback(async (
    campaignId: string,
    companyId: string,
    data: CreateJobOpeningData
  ): Promise<JobOpening | null> => {
    try {
      setLoading(true);
      setError(null);

      // Validation
      if (!campaignId || !companyId) {
        throw new Error('IDs de campagne et entreprise requis');
      }

      if (!data.title || data.title.trim().length < 3) {
        throw new Error('Le titre doit contenir au moins 3 caractères');
      }

      if (!data.description || data.description.trim().length < 10) {
        throw new Error('La description doit contenir au moins 10 caractères');
      }

      const jobOpening = await jobOpenings.create(campaignId, companyId, data);
      toast.success('Offre d\'emploi créée avec succès');
      return jobOpening;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(errorMessage);
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateJobOpening = useCallback(async (
    campaignId: string,
    companyId: string,
    jobId: string,
    data: Partial<CreateJobOpeningData>
  ): Promise<JobOpening | null> => {
    try {
      setLoading(true);
      setError(null);

      if (!campaignId || !companyId || !jobId) {
        throw new Error('IDs de campagne, entreprise et offre requis');
      }

      // Validation des champs fournis
      if (data.title !== undefined && data.title.trim().length < 3) {
        throw new Error('Le titre doit contenir au moins 3 caractères');
      }

      if (data.description !== undefined && data.description.trim().length < 10) {
        throw new Error('La description doit contenir au moins 10 caractères');
      }

      const jobOpening = await jobOpenings.update(campaignId, companyId, jobId, data);
      toast.success('Offre d\'emploi mise à jour');
      return jobOpening;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de mise à jour';
      setError(errorMessage);
      handleApiError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteJobOpening = useCallback(async (
    campaignId: string,
    companyId: string,
    jobId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (!campaignId || !companyId || !jobId) {
        throw new Error('IDs de campagne, entreprise et offre requis');
      }

      await jobOpenings.delete(campaignId, companyId, jobId);
      toast.success('Offre d\'emploi supprimée');
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

  return {
    jobOpeningsList,
    loading,
    error,
    createJobOpening,
    updateJobOpening,
    deleteJobOpening,
    loadJobOpenings,
  };
}
