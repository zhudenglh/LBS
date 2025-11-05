// Validator Utilities Tests

import {
  validatePostTitle,
  validatePostContent,
  validateNickname,
  validateImageSize,
} from '../../src/utils/validator';

describe('Validator Utilities', () => {
  describe('validatePostTitle', () => {
    it('should return valid for correct title', () => {
      const result = validatePostTitle('Valid Title');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty title', () => {
      const result = validatePostTitle('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('discover.validation.title_empty');
    });

    it('should return invalid for title with only spaces', () => {
      const result = validatePostTitle('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('discover.validation.title_empty');
    });

    it('should return invalid for title longer than 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      const result = validatePostTitle(longTitle);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('common.validation.too_long');
    });
  });

  describe('validatePostContent', () => {
    it('should return valid for correct content', () => {
      const result = validatePostContent('Valid content here');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty content', () => {
      const result = validatePostContent('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('discover.validation.content_empty');
    });

    it('should return invalid for content longer than 500 characters', () => {
      const longContent = 'a'.repeat(501);
      const result = validatePostContent(longContent);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('common.validation.too_long');
    });
  });

  describe('validateNickname', () => {
    it('should return valid for correct nickname', () => {
      const result = validateNickname('JohnDoe');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty nickname', () => {
      const result = validateNickname('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('profile.edit.nickname_empty');
    });

    it('should return invalid for nickname longer than 20 characters', () => {
      const longNickname = 'a'.repeat(21);
      const result = validateNickname(longNickname);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('common.validation.too_long');
    });
  });

  describe('validateImageSize', () => {
    it('should return true for valid image size', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validSize = 5 * 1024 * 1024; // 5MB
      expect(validateImageSize(validSize, maxSize)).toBe(true);
    });

    it('should return false for image size exceeding limit', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const invalidSize = 15 * 1024 * 1024; // 15MB
      expect(validateImageSize(invalidSize, maxSize)).toBe(false);
    });

    it('should return true for image size equal to limit', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      expect(validateImageSize(maxSize, maxSize)).toBe(true);
    });
  });
});
