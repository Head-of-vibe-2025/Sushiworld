import {
  formatPrice,
  formatDate,
  formatDateTime,
  formatPoints,
  pointsToEuros,
  eurosToPoints,
} from '../formatting';

describe('formatting utilities', () => {
  describe('formatPrice', () => {
    it('should format price with default euro currency', () => {
      expect(formatPrice(10.5)).toBe('€10.50');
      expect(formatPrice(0)).toBe('€0.00');
      expect(formatPrice(99.99)).toBe('€99.99');
    });

    it('should format price with custom currency', () => {
      expect(formatPrice(10.5, '$')).toBe('$10.50');
      expect(formatPrice(25, '£')).toBe('£25.00');
    });

    it('should handle decimal places correctly', () => {
      expect(formatPrice(10)).toBe('€10.00');
      expect(formatPrice(10.1)).toBe('€10.10');
      expect(formatPrice(10.123)).toBe('€10.12');
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = '2024-01-15T14:30:00Z';
      const formatted = formatDateTime(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatPoints', () => {
    it('should format points with thousand separators', () => {
      expect(formatPoints(1000)).toBe('1,000');
      expect(formatPoints(12345)).toBe('12,345');
      expect(formatPoints(100)).toBe('100');
    });
  });

  describe('pointsToEuros', () => {
    it('should convert points to euros correctly', () => {
      expect(pointsToEuros(100)).toBe(1);
      expect(pointsToEuros(500)).toBe(5);
      expect(pointsToEuros(50)).toBe(0.5);
      expect(pointsToEuros(0)).toBe(0);
    });
  });

  describe('eurosToPoints', () => {
    it('should convert euros to points correctly', () => {
      expect(eurosToPoints(1)).toBe(100);
      expect(eurosToPoints(5)).toBe(500);
      expect(eurosToPoints(0.5)).toBe(50);
      expect(eurosToPoints(0)).toBe(0);
    });

    it('should floor decimal values', () => {
      expect(eurosToPoints(1.99)).toBe(199);
      expect(eurosToPoints(2.55)).toBe(255);
    });
  });
});

