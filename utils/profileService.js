import supabase from './supabaseClient';

/**
 * Fetch user profile data from Supabase
 * @param {string} userId - The user ID to fetch profile for
 * @returns {Promise<Object>} - The result containing data and/or error
 */
export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { data: null, error };
  }
};

/**
 * Update a user's profile in Supabase
 * @param {string} userId - The user ID to update profile for
 * @param {Object} updates - The profile data to update
 * @returns {Promise<Object>} - Result of the update operation
 */
export const updateProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
};

/**
 * Check if a user handle exists
 * @param {string} handle - The handle to check
 * @returns {Promise<boolean>} - Whether the handle exists
 */
export const checkHandleExists = async (handle) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_handle')
      .eq('user_handle', handle)
      .maybeSingle();
    
    if (error) throw error;
    return { exists: !!data, error: null };
  } catch (error) {
    console.error('Error checking handle:', error);
    return { exists: false, error };
  }
};

/**
 * Get user followers
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The followers
 */
export const getFollowers = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id, profiles!follows_follower_id_fkey(id, firstname, lastname, user_handle, avatar_url)')
      .eq('following_id', userId);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting followers:', error);
    return { data: null, error };
  }
};

/**
 * Get users that a user is following
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The followings
 */
export const getFollowing = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('following_id, profiles!follows_following_id_fkey(id, firstname, lastname, user_handle, avatar_url)')
      .eq('follower_id', userId);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error getting following:', error);
    return { data: null, error };
  }
};

/**
 * Follow a user
 * @param {string} followerId - The follower ID
 * @param {string} followingId - The user to follow ID
 * @returns {Promise<Object>} - Result of the operation
 */
export const followUser = async (followerId, followingId) => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId
      })
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error following user:', error);
    return { data: null, error };
  }
};

/**
 * Unfollow a user
 * @param {string} followerId - The follower ID
 * @param {string} followingId - The user to unfollow ID
 * @returns {Promise<Object>} - Result of the operation
 */
export const unfollowUser = async (followerId, followingId) => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .delete()
      .match({
        follower_id: followerId,
        following_id: followingId
      });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { data: null, error };
  }
};

/**
 * Check if a user is following another user
 * @param {string} followerId - The follower ID
 * @param {string} followingId - The following ID
 * @returns {Promise<boolean>} - Whether the user is following
 */
export const isFollowing = async (followerId, followingId) => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .match({
        follower_id: followerId,
        following_id: followingId
      })
      .maybeSingle();
    
    if (error) throw error;
    return { isFollowing: !!data, error: null };
  } catch (error) {
    console.error('Error checking follow status:', error);
    return { isFollowing: false, error };
  }
}; 