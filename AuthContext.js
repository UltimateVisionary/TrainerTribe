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

  // Validate that the user exists in the database
  const validateUser = async (authUser) => {
    if (!authUser || !authUser.id) return null;
    
    try {
      // Check if user exists in the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error || !data) {
        console.error('User validation failed:', error || 'User does not exist in profiles');
        // User not found in profiles table, sign them out
        await supabase.auth.signOut();
        return null;
      }
      
      // User is valid
      return { ...authUser, profile: data };
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check for active session on mount
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          // Validate the user exists in our database
          const validatedUser = await validateUser(session.user);
          setUser(validatedUser);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Validate the user exists in our database
          const validatedUser = await validateUser(session.user);
          setUser(validatedUser);
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
  const signUp = async (email, password, firstName, lastName, user_handle) => {
    try {
      setLoading(true);
      
      // Register user in Supabase
      const { data: { user: newUser }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstname: firstName,
            lastname: lastName,
            user_handle: user_handle,
          },
        },
      });
      
      if (error) throw error;
      
      // Create initial profile record
      if (newUser) {
        try {
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: newUser.id,
            firstname: firstName,
            lastname: lastName,
            user_handle: user_handle,
            email: email,
            created_at: new Date(),
            updated_at: new Date(),
          });
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            throw new Error('Failed to create user profile. Please try again.');
          }
        } catch (profileError) {
          console.error('Error creating initial profile:', profileError);
          throw new Error('Failed to create user profile. Please try again.');
        }
      }
      
      return { user: newUser, error: null };
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
      const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Validate user exists in profiles table
      const validatedUser = await validateUser(authUser);
      if (!validatedUser) {
        throw new Error('User account not found. Please contact support.');
      }
      
      return { user: validatedUser, error: null };
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