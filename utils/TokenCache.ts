import { TokenCache } from '@clerk/clerk-expo/dist/cache';
import * as SecureStore from 'expo-secure-store';

export const SecureStorageTokenCache: TokenCache = {
  getToken(key: string): Promise<string | null> {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error('Fail to get token,, key', key, 'error', JSON.stringify(err));
      return Promise.resolve(null);
    }
  },
  async saveToken(key: string, value: string): Promise<void> {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('Fail to save token, key', key, 'error', JSON.stringify(err));
    }
  },
};
