import supabase from './supabaseClient';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

/**
 * Generate a unique file name for storage
 * @param {string} prefix - Prefix for the file name (e.g., 'post', 'avatar')
 * @param {string} fileExt - File extension (e.g., '.jpg', '.mp4')
 * @returns {string} - Unique file name
 */
const generateFileName = (prefix, fileExt) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${randomString}${fileExt}`;
};

/**
 * Get file extension from URI or file name
 * @param {string} uri - File URI or name
 * @returns {string} - File extension with dot (e.g., '.jpg')
 */
const getFileExtension = (uri) => {
  const parts = uri.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
};

/**
 * Get mime type from URI or file extension
 * @param {string} uri - File URI or name
 * @returns {string} - Mime type
 */
const getMimeType = (uri) => {
  const ext = getFileExtension(uri).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.mp4':
      return 'video/mp4';
    case '.mov':
      return 'video/quicktime';
    default:
      return 'application/octet-stream';
  }
};

/**
 * Compress an image to reduce file size
 * @param {string} uri - Image URI
 * @param {Object} options - Compression options
 * @returns {Promise<string>} - Compressed image URI
 */
export const compressImage = async (uri, options = { quality: 0.7, width: 1080 }) => {
  try {
    const result = await manipulateAsync(
      uri,
      [{ resize: { width: options.width } }],
      { compress: options.quality, format: SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return uri; // Return original if compression fails
  }
};

/**
 * Upload a file to Supabase storage
 * @param {string} bucketName - Storage bucket name
 * @param {string} filePath - Local file path/URI
 * @param {string} fileName - Name to save the file as (optional)
 * @returns {Promise<Object>} - Upload result
 */
export const uploadFile = async (bucketName, filePath, fileName = null) => {
  try {
    console.log(`Attempting to upload to bucket: ${bucketName}`);
    
    // Generate unique file name if not provided
    const fileExt = getFileExtension(filePath);
    const finalFileName = fileName || generateFileName(bucketName, fileExt);
    
    let uploadResult;
    
    // Handle different platforms
    if (Platform.OS === 'web') {
      // For web, we assume filePath is a File object
      uploadResult = await supabase
        .storage
        .from(bucketName)
        .upload(finalFileName, filePath, {
          contentType: getMimeType(filePath),
          upsert: true
        });
    } else {
      // For native platforms, read file as base64
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      
      const base64 = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      uploadResult = await supabase
        .storage
        .from(bucketName)
        .upload(finalFileName, decode(base64), {
          contentType: getMimeType(filePath),
          upsert: true
        });
    }
    
    if (uploadResult.error) {
      console.error(`Error uploading to ${bucketName}:`, uploadResult.error);
      throw uploadResult.error;
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(finalFileName);
    
    console.log(`Successfully uploaded to ${bucketName}/${finalFileName}`);
    
    return { 
      data: { 
        fileName: finalFileName,
        publicUrl: urlData.publicUrl,
        path: uploadResult.data.path
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { data: null, error };
  }
};

/**
 * Pick images from device library
 * @param {Object} options - Picker options
 * @returns {Promise<Object>} - Selected images
 */
export const pickImages = async (options = { mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true }) => {
  try {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return { assets: null, error: 'Permission to access media library was denied' };
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: options.mediaTypes,
      allowsMultipleSelection: options.allowsMultipleSelection,
      quality: 1,
    });
    
    if (result.canceled) {
      return { assets: null, error: 'User cancelled image selection' };
    }
    
    return { assets: result.assets, error: null };
  } catch (error) {
    console.error('Error picking images:', error);
    return { assets: null, error };
  }
};

/**
 * Take photo with device camera
 * @returns {Promise<Object>} - Captured image
 */
export const takePhoto = async () => {
  try {
    // Request permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      return { asset: null, error: 'Permission to access camera was denied' };
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    
    if (result.canceled) {
      return { asset: null, error: 'User cancelled photo capture' };
    }
    
    return { asset: result.assets[0], error: null };
  } catch (error) {
    console.error('Error taking photo:', error);
    return { asset: null, error };
  }
};

/**
 * Delete a file from Supabase storage
 * @param {string} bucketName - Storage bucket name
 * @param {string} fileName - Name of the file to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFile = async (bucketName, fileName) => {
  try {
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([fileName]);
    
    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error };
  }
}; 