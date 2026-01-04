/**
 * Core Scrubber Engine for PII Sanitization
 *
 * This module handles the detection and masking of Personally Identifiable Information (PII)
 * using regex patterns and validation algorithms. All processing happens client-side.
 */

import { PIIPatterns, PatternType, PIIMetadata } from './patterns';

/**
 * Secret Map entry for reversible sanitization
 * Maps tokens back to their original values
 */
export interface SecretEntry {
  token: string;
  originalValue: string;
  type: PatternType;
}

/**
 * Scrubbing options to enable/disable specific patterns
 */
export interface ScrubberOptions {
  email: boolean;
  creditCard: boolean;
  phone: boolean;
  ssn: boolean;
}

/**
 * Default scrubbing options (all patterns enabled)
 */
export const DEFAULT_OPTIONS: ScrubberOptions = {
  email: true,
  creditCard: true,
  phone: true,
  ssn: true,
};

/**
 * Luhn Algorithm implementation for credit card validation
 * @param cardNumber The card number to validate (digits only, no separators)
 * @returns true if valid, false otherwise
 */
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber;

  // Card numbers should be between 13 and 19 digits
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  // Loop through digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Validates if a potential credit card number is valid using Luhn algorithm
 * Extracts match, strips ALL non-digits BEFORE validation
 * If valid, the *original* match (with dashes/spaces) will be replaced
 * @param potentialCC The potential credit card number (may have any spacing/dashes)
 * @returns true if valid credit card, false otherwise
 */
function isValidCreditCard(potentialCC: string): boolean {
  // Extract ONLY digits for validation (remove ALL non-digit characters)
  const digits = potentialCC.replace(/\D/g, '');

  // Card numbers should be between 13 and 19 digits
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  return luhnCheck(digits);
}

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Scrubs PII from the input text and returns the sanitized text along with the secret map
 * @param input The input text to scrub
 * @param options Scrubbing options to enable/disable specific patterns
 * @returns Object containing the sanitized text and the secret map
 */
export function scrubPII(
  input: string,
  options: ScrubberOptions = DEFAULT_OPTIONS
): { sanitized: string; secrets: SecretEntry[] } {
  let sanitized = input;
  const secrets: SecretEntry[] = [];

  // Track seen values to avoid duplicate tokens for same value
  const seenValues = new Map<string, string>();

  // Define pattern rules with their validators
  const patternRules: Array<{
    pattern: PatternType;
    regex: RegExp;
    enabled: boolean;
    validator?: (match: string) => boolean;
  }> = [];

  // 1. Email addresses
  if (options.email) {
    patternRules.push({
      pattern: 'email',
      regex: PIIPatterns.email,
      enabled: true,
    });
  }

  // 2. Credit cards (with Luhn validation)
  if (options.creditCard) {
    patternRules.push({
      pattern: 'creditCard',
      regex: PIIPatterns.creditCard,
      enabled: true,
      validator: isValidCreditCard,
    });
  }

  // 3. International phone numbers (more specific, check first)
  if (options.phone) {
    patternRules.push({
      pattern: 'phoneInternational',
      regex: PIIPatterns.phoneInternational,
      enabled: true,
    });
  }

  // 4. US phone numbers
  if (options.phone) {
    patternRules.push({
      pattern: 'phoneUS',
      regex: PIIPatterns.phoneUS,
      enabled: true,
    });
  }

  // 5. SSN
  if (options.ssn) {
    patternRules.push({
      pattern: 'ssn',
      regex: PIIPatterns.ssn,
      enabled: true,
    });
  }

  // 6. US Passport numbers
  if (options.ssn) {
    patternRules.push({
      pattern: 'usPassport',
      regex: PIIPatterns.usPassport,
      enabled: true,
    });
  }

  // Process each pattern rule
  for (const rule of patternRules) {
    let match;
    const regex = new RegExp(rule.regex.source, rule.regex.flags);

    // Collect all matches first (store original positions from input)
    const matches: Array<{
      value: string;
      start: number;
      end: number;
    }> = [];

    while ((match = regex.exec(input)) !== null) {
      const matchValue = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + matchValue.length;

      // Apply custom validator if provided
      if (rule.validator && !rule.validator(matchValue)) {
        continue;
      }

      matches.push({
        value: matchValue,
        start: startIndex,
        end: endIndex,
      });
    }

    // Process matches for this pattern
    for (const matchData of matches) {
      const { value: matchValue } = matchData;

      // Check if we've already seen this exact value
      let token = seenValues.get(matchValue);
      if (!token) {
        // Generate a new token
        const existingCount = secrets.filter((s) => s.type === rule.pattern).length;
        const label = PIIMetadata[rule.pattern].label;
        token = `[${label}_${existingCount + 1}]`;
        seenValues.set(matchValue, token);

        // Add to secrets map
        secrets.push({
          token,
          originalValue: matchValue,
          type: rule.pattern,
        });
      }
    }
  }

  // Now replace all matches in a single pass for each pattern
  // This ensures we don't accidentally scrub inside tokens we just created
  for (const rule of patternRules) {
    // Get all secrets for this pattern
    const patternSecrets = secrets.filter((s) => s.type === rule.pattern);

    // Sort by original value length (longest first) to handle overlapping patterns
    patternSecrets.sort((a, b) => b.originalValue.length - a.originalValue.length);

    // Replace each occurrence
    for (const secret of patternSecrets) {
      const escapedValue = escapeRegExp(secret.originalValue);
      const tokenRegex = new RegExp(escapedValue, 'g');
      sanitized = sanitized.replace(tokenRegex, secret.token);
    }
  }

  return { sanitized, secrets };
}

/**
 * Restores original text from sanitized text using the secret map
 * Uses fuzzy matching to handle AI-modified tokens (e.g., removed brackets, changed case)
 * @param sanitized The sanitized text to restore
 * @param secrets The secret map containing token to original value mappings
 * @returns The restored text with original values
 */
export function restorePII(sanitized: string, secrets: SecretEntry[]): string {
  let restored = sanitized;

  // Sort secrets by token length (longest first) to avoid partial replacements
  // This ensures [EMAIL_10] is replaced before [EMAIL_1]
  const sortedSecrets = [...secrets].sort((a, b) => b.token.length - a.token.length);

  for (const secret of sortedSecrets) {
    // Extract the core ID from the token (e.g., "[EMAIL_1]" → "EMAIL_1")
    const coreID = secret.token.replace(/^\[|\]$/g, '');
    
    // Escape special regex characters in the core ID
    const escapedCoreID = escapeRegExp(coreID);
    
    // Create a flexible regex that matches:
    // - Optional opening: [ or ( or ** (markdown)
    // - The core ID (case insensitive)
    // - Optional closing: ] or ) or ** (markdown)
    // Pattern explanation:
    // (?:\[|\(|\*\*)? = Optional non-capturing group for [, (, or **
    // (${escapedCoreID}) = Capture the core ID
    // (?:\]|\)|\*\*)? = Optional non-capturing group for ], ), or **
    const fuzzyRegex = new RegExp(
      `(?:\\[|\\(|\\*\\*)?${escapedCoreID}(?:\\]|\\)|\\*\\*)?`,
      'gi' // Case insensitive + global
    );

    restored = restored.replace(fuzzyRegex, secret.originalValue);
  }

  return restored;
}

/**
 * Counts the number of each PII type in the secret map
 * @param secrets The secret map
 * @returns An object with counts for each PII type
 */
export function countPIIByType(secrets: SecretEntry[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const secret of secrets) {
    const label = PIIMetadata[secret.type].label;
    counts[label] = (counts[label] || 0) + 1;
  }

  return counts;
}
