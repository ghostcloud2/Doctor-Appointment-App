import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { useAuth } from './useAuth';

export function useAppointments() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  async function fetchDoctors() {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profile:profiles(full_name, latitude, longitude)
        `)
        .order('created_at');

      if (error) throw error;
      setDoctors(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAppointments() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', format(new Date(), 'yyyy-MM-dd'));

      if (error) throw error;
      setAppointments(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function bookAppointment(doctorId: string, date: Date, time: string) {
    try {
      const { error } = await supabase.from('appointments').insert({
        patient_id: user?.id,
        doctor_id: doctorId,
        appointment_date: format(date, 'yyyy-MM-dd'),
        appointment_time: time,
        status: 'pending'
      });

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      setError(error.message);
    }
  }

  async function cancelAppointment(appointmentId: string) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .eq('patient_id', user?.id);

      if (error) throw error;
      fetchAppointments();
    } catch (error) {
      setError(error.message);
    }
  }

  return {
    doctors,
    appointments,
    loading,
    error,
    bookAppointment,
    cancelAppointment,
  };
}