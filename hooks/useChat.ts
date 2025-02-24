import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
    fetchDoctors();

    const subscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchMessages() {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`patient_id.eq.${user?.id},doctor_id.eq.${user?.id}`)
        .order('created_at');

      if (error) throw error;
      setMessages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDoctors() {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profile:profiles(full_name)
        `)
        .order('created_at');

      if (error) throw error;
      setDoctors(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function sendMessage(message: string) {
    try {
      const { error } = await supabase.from('chats').insert({
        message,
        sent_by: user?.id,
        patient_id: user?.id,
        doctor_id: doctors[0]?.id, // For simplicity, sending to first doctor
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  }

  return {
    messages,
    doctors,
    loading,
    error,
    sendMessage,
  };
}