import { isValidEmail, isValidPhone, sanitizeEmail } from '../validation';

describe('validation utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid phone numbers', () => {
      expect(isValidPhone('+32 123 456 789')).toBe(true);
      expect(isValidPhone('0123456789')).toBe(true);
      expect(isValidPhone('+352 12345678')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false); // Too short
      expect(isValidPhone('abc123')).toBe(false); // Contains letters
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('sanitizeEmail', () => {
    it('should trim and lowercase email addresses', () => {
      expect(sanitizeEmail('  Test@Example.COM  ')).toBe('test@example.com');
      expect(sanitizeEmail('USER@DOMAIN.COM')).toBe('user@domain.com');
      expect(sanitizeEmail('  lowercase@test.com  ')).toBe('lowercase@test.com');
    });
  });
});

