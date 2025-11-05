// Time Utilities Tests

import { formatTimeAgo, getTimeValue, formatDate, formatDateTime } from '../../src/utils/time';

describe('Time Utilities', () => {
  const now = Date.now();

  describe('formatTimeAgo', () => {
    it('should return just_now for recent timestamps', () => {
      const recentTime = now - 30000; // 30 seconds ago
      expect(formatTimeAgo(recentTime)).toBe('common.time.just_now');
    });

    it('should return minutes_ago for timestamps within an hour', () => {
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      expect(formatTimeAgo(fiveMinutesAgo)).toBe('common.time.minutes_ago');
    });

    it('should return hours_ago for timestamps within a day', () => {
      const twoHoursAgo = now - 2 * 60 * 60 * 1000;
      expect(formatTimeAgo(twoHoursAgo)).toBe('common.time.hours_ago');
    });

    it('should return days_ago for timestamps within a month', () => {
      const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
      expect(formatTimeAgo(threeDaysAgo)).toBe('common.time.days_ago');
    });

    it('should return long_ago for old timestamps', () => {
      const twoMonthsAgo = now - 60 * 24 * 60 * 60 * 1000;
      expect(formatTimeAgo(twoMonthsAgo)).toBe('common.time.long_ago');
    });
  });

  describe('getTimeValue', () => {
    it('should return 0 for recent timestamps', () => {
      const recentTime = now - 30000;
      expect(getTimeValue(recentTime)).toBe(0);
    });

    it('should return correct minutes', () => {
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      expect(getTimeValue(fiveMinutesAgo)).toBe(5);
    });

    it('should return correct hours', () => {
      const twoHoursAgo = now - 2 * 60 * 60 * 1000;
      expect(getTimeValue(twoHoursAgo)).toBe(2);
    });

    it('should return correct days', () => {
      const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
      expect(getTimeValue(threeDaysAgo)).toBe(3);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const result = formatDate(timestamp);
      expect(result).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const timestamp = new Date('2024-01-15T10:30:00').getTime();
      const result = formatDateTime(timestamp);
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
