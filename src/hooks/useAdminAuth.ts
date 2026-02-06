import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface AdminAuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage admin authentication and role verification
 * Uses server-side has_role() function to prevent privilege escalation
 */
export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
    error: null
  });

  // Check if user has admin role using server-side function
  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc("has_role", { _user_id: userId, _role: "admin" });

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }

      return data === true;
    } catch (err) {
      console.error("Failed to check admin role:", err);
      return false;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Use setTimeout to avoid potential race conditions
          setTimeout(async () => {
            const isAdmin = await checkAdminRole(session.user.id);
            setState({
              user: session.user,
              isAdmin,
              isLoading: false,
              error: null
            });
          }, 0);
        } else {
          setState({
            user: null,
            isAdmin: false,
            isLoading: false,
            error: null
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const isAdmin = await checkAdminRole(session.user.id);
        setState({
          user: session.user,
          isAdmin,
          isLoading: false,
          error: null
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
        return { success: false, error: error.message };
      }

      if (data.user) {
        const isAdmin = await checkAdminRole(data.user.id);
        
        if (!isAdmin) {
          await supabase.auth.signOut();
          const errorMsg = "Access denied. Admin privileges required.";
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMsg
          }));
          return { success: false, error: errorMsg };
        }

        setState({
          user: data.user,
          isAdmin: true,
          isLoading: false,
          error: null
        });
        return { success: true };
      }

      return { success: false, error: "Unknown error" };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Sign in failed";
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg
      }));
      return { success: false, error: errorMsg };
    }
  }, [checkAdminRole]);

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      isAdmin: false,
      isLoading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    signIn,
    signOut
  };
};
