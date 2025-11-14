// src/services/imageUploadService.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

export const uploadProductImage = async (file: File, productName: string): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create unique filename
    const timestamp = Date.now();
    const sanitizedName = productName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${sanitizedName}_${timestamp}_${file.name}`;
    
    // Create storage reference
    const storageRef = ref(storage, `product-images/${filename}`);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract path from URL
    const path = imageUrl.split('/o/')[1]?.split('?')[0];
    if (!path) return;
    
    const decodedPath = decodeURIComponent(path);
    const storageRef = ref(storage, decodedPath);
    
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error, just log it
  }
};