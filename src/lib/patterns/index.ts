/**
 * Regex patterns for PII detection
 * All patterns are designed to minimize false positives while maintaining broad coverage
 */

export const PIIPatterns = {
  /**
   * Email pattern
   * Matches most valid email formats
   * Example: john.doe@example.com, user+tag@domain.co.uk
   */
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

  /**
   * Credit card pattern (LOOSE matching for any sequence of 13-19 digits with optional separators)
   * Matches sequences like:
   * - 4111111111111111 (consecutive)
   * - 4111-1111-1111-1111 (with dashes)
   * - 4111 1111 1111 1111 (with spaces)
   * - 4111-1111 1111111 (mixed separators)
   * - 41 11-11-11 11 11-11 11 (weird spacing)
   *
   * Note: Validation is done with Luhn algorithm to avoid false positives
   * The LOOSE regex captures sequences of digits with separators
   */
  creditCard: /\d[\d\s-]{11,18}\d/g,

  /**
   * US Phone number pattern
   * Matches various US phone number formats
   * Examples: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
   */
  phoneUS: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,

  /**
   * International phone number pattern
   * Matches international phone numbers with country code
   * Examples: +1-123-456-7890, +44 20 7123 4567, +91 98765 43210
   */
  phoneInternational: /\+\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,

  /**
   * SSN pattern (US Social Security Number)
   * Matches SSN with common separators or hyphens
   * Examples: 123-45-6789, 123 45 6789, 123456789
   */
  ssn: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,

  /**
   * US Passport number pattern
   * Matches 9-digit US passport numbers
   */
  usPassport: /\b\d{9}\b/g,

  /**
   * Driver's license pattern (generic)
   * Matches alphanumeric strings that resemble driver's license numbers
   * Examples: A1234567, AB-123-4567
   */
  driversLicense: /\b[A-Za-z]{1,2}[-\s]?\d{3,7}\b/g,
} as const;

/**
 * Pattern types for the scrubber
 */
export type PatternType = keyof typeof PIIPatterns;

/**
 * PII Type metadata for token generation
 */
export const PIIMetadata = {
  email: { label: 'EMAIL', color: 'text-red-500' },
  creditCard: { label: 'CC', color: 'text-orange-500' },
  phoneUS: { label: 'PHONE', color: 'text-blue-500' },
  phoneInternational: { label: 'PHONE', color: 'text-blue-500' },
  ssn: { label: 'ID', color: 'text-purple-500' },
  usPassport: { label: 'ID', color: 'text-purple-500' },
  driversLicense: { label: 'ID', color: 'text-purple-500' },
} as const;
