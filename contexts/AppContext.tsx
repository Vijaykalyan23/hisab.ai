import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { processReceipt, getUserReceipts, generateUserId, ProcessReceiptResponse } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface AppState {
  user: User | null;
  receipts: ProcessReceiptResponse[];
  isLoading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  // User actions
  setUser: (user: User) => void;
  logout: () => void;
  
  // Receipt actions
  processReceiptImage: (imageUri: string) => Promise<ProcessReceiptResponse>;
  loadUserReceipts: () => Promise<void>;
  clearError: () => void;
  
  // UI state
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@hisab_user';
const RECEIPTS_STORAGE_KEY = '@hisab_receipts';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    receipts: [],
    isLoading: false,
    error: null,
  });

  // Initialize user and load data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Load user from storage
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      let user: User;
      
      if (storedUser) {
        user = JSON.parse(storedUser);
      } else {
        // Generate new user
        user = { id: generateUserId() };
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
      
      // Load receipts from storage
      const storedReceipts = await AsyncStorage.getItem(RECEIPTS_STORAGE_KEY);
      const receipts = storedReceipts ? JSON.parse(storedReceipts) : [];
      
      setState(prev => ({
        ...prev,
        user,
        receipts,
        isLoading: false,
      }));
      
      console.log('App initialized with user:', user.id);
    } catch (error) {
      console.error('Error initializing app:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to initialize app',
        isLoading: false,
      }));
    }
  };

  const setUser = async (user: User) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      setState(prev => ({ ...prev, user }));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([USER_STORAGE_KEY, RECEIPTS_STORAGE_KEY]);
      setState({
        user: null,
        receipts: [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const processReceiptImage = async (imageUri: string): Promise<ProcessReceiptResponse> => {
    if (!state.user) {
      throw new Error('User not initialized');
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('Processing receipt for user:', state.user.id);
      const result = await processReceipt(imageUri, state.user.id);
      
      // Add to receipts list
      const updatedReceipts = [result, ...state.receipts];
      
      // Save to storage
      await AsyncStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(updatedReceipts));
      
      setState(prev => ({
        ...prev,
        receipts: updatedReceipts,
        isLoading: false,
      }));
      
      console.log('Receipt processed successfully:', result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process receipt';
      console.error('Error processing receipt:', error);
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      
      throw error;
    }
  };

  const loadUserReceipts = async () => {
    if (!state.user) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Try to load from backend (if endpoint exists)
      const backendReceipts = await getUserReceipts(state.user.id);
      
      if (backendReceipts.length > 0) {
        // Save to storage
        await AsyncStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(backendReceipts));
        
        setState(prev => ({
          ...prev,
          receipts: backendReceipts,
          isLoading: false,
        }));
      } else {
        // Load from local storage
        const storedReceipts = await AsyncStorage.getItem(RECEIPTS_STORAGE_KEY);
        const receipts = storedReceipts ? JSON.parse(storedReceipts) : [];
        
        setState(prev => ({
          ...prev,
          receipts,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Error loading receipts:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load receipts',
        isLoading: false,
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const contextValue: AppContextType = {
    ...state,
    setUser,
    logout,
    processReceiptImage,
    loadUserReceipts,
    clearError,
    setLoading,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};