import { useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react';
import { supabase } from '../../../shared/api/supabaseClient';
import { AuthContext } from '../context/AuthContext';
import type { UserProfile } from '../context/AuthContext';
import type { User, Session } from '@supabase/supabase-js';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch profile
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data as UserProfile);
      } else {
        setProfile(null);
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };
  
  const signInWithEmail = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };
  
  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password: pass,
      options: {
        data: {
          full_name: displayName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getDisplayName = () => {
    if (!user) return '';
    return profile?.full_name || user.user_metadata?.display_name || 'Jugador';
  };

  const refreshProfile = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setProfile(data as UserProfile);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isLoading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, getDisplayName, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
