"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useStore } from '@/store/useStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser } = useStore();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          avatar_url: session.user.user_metadata?.avatar_url || '',
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          avatar_url: session.user.user_metadata?.avatar_url || '',
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setCurrentUser]);

  return <>{children}</>;
}
