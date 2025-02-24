import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Symptom {
  id: string;
  name: string;
  description: string | null;
  severity_level: number;
}

interface Condition {
  id: string;
  name: string;
  description: string | null;
  recommended_specialist: string | null;
  symptoms: string[];
}

export function useSymptoms() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSymptoms();
    fetchConditions();
  }, []);

  async function fetchSymptoms() {
    try {
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .order('name');

      if (error) throw error;
      setSymptoms(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchConditions() {
    try {
      const { data, error } = await supabase
        .from('conditions')
        .select('*')
        .order('name');

      if (error) throw error;
      setConditions(data);
    } catch (error: any) {
      setError(error.message);
    }
  }

  return {
    symptoms,
    conditions,
    loading,
    error,
  };
}