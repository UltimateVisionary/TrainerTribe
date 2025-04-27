import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from './utils/supabaseClient';
import { ActivityIndicator, AppState, View } from 'react-native';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on mount
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, firstName, lastName, handle) => {
    try {
      setLoading(true);

      console.log('values: ', email, password, firstName, lastName, handle);
      
      // Register user in Supabase
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            user_handle: handle,
            firstname: firstName,
            lastname: lastName,
          },
        },
      });
      
      if (error) throw error;
      
      // Create initial profile record
      // if (user) {
      //   try {
      //     await supabase.from('profiles').upsert({
      //       id: user.id,
      //       firstname: firstName,
      //       lastname: lastName,
      //       user_handle: handle,
      //     });
      //   } catch (profileError) {
      //     console.error('Error creating initial profile:', profileError);
      //   }
      // }
      
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'trainertribleapp://reset-password',
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// Loading component that can be used when waiting for auth
export const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
); 