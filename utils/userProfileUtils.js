import supabase from './supabaseClient';

/**
 * Generate a unique handle based on first name and last name initial
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name (at least one character)
 * @returns {Promise<string>} - A unique handle
 */
export const generateUniqueHandle = async (firstName, lastName) => {
  try {
    if (!firstName || !lastName || lastName.length === 0) {
      throw new Error('First name and last name are required');
    }
    
    // Format: lowercase firstname + first letter of lastname
    const baseHandle = (firstName + lastName[0]).toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if the base handle already exists
    let currentHandle = baseHandle;
    let counter = 1;
    let handleExists = true;
    
    while (handleExists) {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_handle')
        .eq('user_handle', currentHandle)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking handle:', error);
        throw error;
      }
      
      // If no matching handle found, we can use this one
      if (!data) {
        handleExists = false;
      } else {
        // Try the next number
        currentHandle = `${baseHandle}${counter}`;
        counter++;
      }
    }
    
    return currentHandle;
  } catch (error) {
    console.error('Error generating unique handle:', error);
    // Fallback to a timestamp-based handle if needed
    return `user${Date.now().toString().substring(7)}`;
  }
};

/**
 * Fetch user profile data from Supabase
 * @param {string} userId - The user ID to fetch profile for
 * @param {Function} t - Translation function for default values
 * @returns {Promise<Object>} - The user profile data
 */
export const fetchUserProfile = async (userId, t) => {
  try {
    // Try to fetch user profile from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

   
    if (error) {
      console.error('Error fetching profile:', error);
      
      // Get user data from auth.users if profile doesn't exist
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }
      
      // Return basic profile with auth data
      return {
        id: userId,
        name: userData?.user?.user_metadata?.full_name || userData?.user?.email?.split('@')[0] || '',
        handle: '@' + (userData?.user?.email?.split('@')[0] || ''),
        bio: t ? t('defaultBio') : '',
        followers: "0",
        following: "0",
        posts: "0",
        image: null,
        isVerified: false,
        isPremiumCreator: false,
        email: userData?.user?.email || '',
        achievementsPublic: true,
        followingPublic: true,
        socialLinks: []
      };
    }
    
    // Return the profile data
    return {
      id: userId,
      firstname: data.firstname || '',
      lastname: data.lastname || '',
      user_handle: data.user_handle || '',
      bio: data.bio || (t ? t('defaultBio') : ''),
      followers: data.followers_count?.toString() || "0",
      following: data.following_count?.toString() || "0",
      posts: data.posts_count?.toString() || "0",
      image: data.avatar_url || null,
      isVerified: data.is_verified || false,
      isPremiumCreator: data.is_premium || false,
      email: data.email || '',
      achievementsPublic: data.achievements_public !== false,
      followingPublic: data.following_public !== false,
      socialLinks: data.social_links || []
    };
  } catch (error) {
    console.error('Error in profile fetch:', error);
    return null;
  }
};

/**
 * Update a user's profile in Supabase
 * @param {string} userId - The user ID to update profile for
 * @param {Object} profileData - The profile data to update
 * @returns {Promise<Object>} - Result of the update operation
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: profileData.name,
        handle: profileData.handle,
        bio: profileData.bio,
        avatar_url: profileData.image,
        is_verified: profileData.isVerified,
        is_premium: profileData.isPremiumCreator,
        achievements_public: profileData.achievementsPublic,
        following_public: profileData.followingPublic,
        social_links: profileData.socialLinks,
        updated_at: new Date()
      });
    
    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving profile:', error);
    return { success: false, error: error.message };
  }
}; 