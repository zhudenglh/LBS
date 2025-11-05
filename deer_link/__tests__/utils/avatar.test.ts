// Avatar Utilities Tests

import { generateRandomAvatar, generateRandomNickname, generateUUID } from '../../src/utils/avatar';
import { AVATAR_EMOJIS } from '../../src/constants/config';

describe('Avatar Utilities', () => {
  describe('generateRandomAvatar', () => {
    it('should return an emoji from AVATAR_EMOJIS', () => {
      const avatar = generateRandomAvatar();
      expect(AVATAR_EMOJIS).toContain(avatar);
    });

    it('should return different avatars on multiple calls (probabilistic)', () => {
      const avatars = new Set();
      for (let i = 0; i < 50; i++) {
        avatars.add(generateRandomAvatar());
      }
      // Should have at least a few different avatars in 50 attempts
      expect(avatars.size).toBeGreaterThan(1);
    });
  });

  describe('generateRandomNickname', () => {
    it('should return a string', () => {
      const nickname = generateRandomNickname();
      expect(typeof nickname).toBe('string');
    });

    it('should contain a number at the end', () => {
      const nickname = generateRandomNickname();
      expect(/\d+$/.test(nickname)).toBe(true);
    });

    it('should generate different nicknames on multiple calls', () => {
      const nicknames = new Set();
      for (let i = 0; i < 20; i++) {
        nicknames.add(generateRandomNickname());
      }
      // Should have different nicknames due to random numbers
      expect(nicknames.size).toBeGreaterThan(1);
    });

    it('should have reasonable length', () => {
      const nickname = generateRandomNickname();
      expect(nickname.length).toBeGreaterThan(5);
      expect(nickname.length).toBeLessThan(30);
    });
  });

  describe('generateUUID', () => {
    it('should return a string', () => {
      const uuid = generateUUID();
      expect(typeof uuid).toBe('string');
    });

    it('should match UUID format', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(uuid)).toBe(true);
    });

    it('should generate unique UUIDs', () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(generateUUID());
      }
      // All UUIDs should be unique
      expect(uuids.size).toBe(100);
    });

    it('should have correct length', () => {
      const uuid = generateUUID();
      expect(uuid.length).toBe(36); // 8-4-4-4-12 + 4 hyphens
    });
  });
});
