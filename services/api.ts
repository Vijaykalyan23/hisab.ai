// API Service for Hisab.ai Backend Integration
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Backend configuration
const API_BASE_URL = 'https://hisaabai-service-174268603299.africa-south1.run.app';
const AGENT_ENDPOINT = `${API_BASE_URL}/agents/HisabAgent/process`;

// Types for API responses
export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface ReceiptSummary {
  merchant_name: string;
  total_amount: number;
  tax_amount?: number;
  date: string;
  currency: string;
}

export interface ProcessReceiptResponse {
  items: ReceiptItem[];
  summary: ReceiptSummary;
  wallet_pass_link?: string;
  status: 'success' | 'error' | 'processing';
  message?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

// Generate unique user ID
export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Convert image to base64
const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
};

// Process receipt with backend
export const processReceipt = async (
  imageUri: string,
  userId: string
): Promise<ProcessReceiptResponse> => {
  try {
    // Convert image to base64
    const base64Image = await convertImageToBase64(imageUri);
    
    // Prepare request body
    const requestBody = {
      message: `Process this receipt: ${base64Image}`,
      user_id: userId,
    };

    console.log('Sending request to:', AGENT_ENDPOINT);
    console.log('Request body structure:', {
      message: 'Process this receipt: [base64_image_data]',
      user_id: userId,
    });

    // Make API call
    const response = await fetch(AGENT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Validate response structure
    if (!data.items || !data.summary) {
      throw new Error('Invalid response format from backend');
    }

    return data as ProcessReceiptResponse;
  } catch (error) {
    console.error('Error processing receipt:', error);
    throw error;
  }
};

// Get user receipts (if backend supports it)
export const getUserReceipts = async (userId: string): Promise<ProcessReceiptResponse[]> => {
  try {
    // This would be implemented if your backend has a GET endpoint for user receipts
    // For now, we'll return empty array as this endpoint might not exist
    console.log('Getting receipts for user:', userId);
    return [];
  } catch (error) {
    console.error('Error getting user receipts:', error);
    return [];
  }
};

// Image picker utilities
export const pickImageFromCamera = async (): Promise<string | null> => {
  try {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Camera permission is required to take photos');
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking image from camera:', error);
    throw error;
  }
};

export const pickImageFromGallery = async (): Promise<string | null> => {
  try {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Media library permission is required to select photos');
    }

    // Launch image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    throw error;
  }
};