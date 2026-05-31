import * as SecureStore from 'expo-secure-store';
import { logger } from './logger';

const STORAGE_VERSION = 'v1_';

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(`${STORAGE_VERSION}${key}`, value);
      logger.debug(`[Storage] Set item: ${STORAGE_VERSION}${key}`);
    } catch (e) {
      logger.error(`[Storage] Error setting item ${key}: ${e}`);
    }
  },
  async getItem(key: string): Promise<string | null> {
    try {
      const val = await SecureStore.getItemAsync(`${STORAGE_VERSION}${key}`);
      logger.debug(`[Storage] Get item: ${STORAGE_VERSION}${key} -> ${val ? 'found' : 'null'}`);
      return val;
    } catch (e) {
      logger.error(`[Storage] Error getting item ${key}: ${e}`);
      return null;
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(`${STORAGE_VERSION}${key}`);
      logger.debug(`[Storage] Removed item: ${STORAGE_VERSION}${key}`);
    } catch (e) {
      logger.error(`[Storage] Error removing item ${key}: ${e}`);
    }
  },
};
