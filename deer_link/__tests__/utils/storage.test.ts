// Storage Utilities Tests

import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../src/utils/storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should get item from storage', async () => {
      const mockValue = 'test-value';
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockValue);

      const result = await storage.get('test-key');

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toBe(mockValue);
    });

    it('should return null when item does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storage.get('non-existent-key');

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await storage.get('error-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set item in storage', async () => {
      await storage.set('test-key', 'test-value');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(storage.set('error-key', 'value')).resolves.not.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove item from storage', async () => {
      await storage.remove('test-key');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(storage.remove('error-key')).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all storage', async () => {
      await storage.clear();

      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.clear as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(storage.clear()).resolves.not.toThrow();
    });
  });

  describe('getObject', () => {
    it('should get and parse object from storage', async () => {
      const mockObject = { name: 'John', age: 30 };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockObject));

      const result = await storage.getObject('test-key');

      expect(result).toEqual(mockObject);
    });

    it('should return null when item does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storage.getObject('non-existent-key');

      expect(result).toBeNull();
    });

    it('should return null on JSON parse error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-json');

      const result = await storage.getObject('invalid-key');

      expect(result).toBeNull();
    });

    it('should return null on storage error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await storage.getObject('error-key');

      expect(result).toBeNull();
    });
  });

  describe('setObject', () => {
    it('should stringify and set object in storage', async () => {
      const mockObject = { name: 'Jane', age: 25 };

      await storage.setObject('test-key', mockObject);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(mockObject));
    });

    it('should handle nested objects', async () => {
      const mockObject = {
        user: {
          name: 'Alice',
          preferences: {
            theme: 'dark',
            language: 'en',
          },
        },
      };

      await storage.setObject('nested-key', mockObject);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('nested-key', JSON.stringify(mockObject));
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(storage.setObject('error-key', { test: 'value' })).resolves.not.toThrow();
    });
  });
});
