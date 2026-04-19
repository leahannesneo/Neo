import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (id) => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.warn('ProfileContext: Fehler beim Laden des Profils', fetchError);
      setError(fetchError);
    } else {
      setProfile(data);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }
    fetchProfile(userId);
  }, [userId, fetchProfile]);

  const refresh = useCallback(() => {
    if (userId) fetchProfile(userId);
  }, [userId, fetchProfile]);

  const onboardingCompleted = profile?.onboarding_completed_at != null;

  return (
    <ProfileContext.Provider value={{ profile, loading, error, refresh, onboardingCompleted }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
