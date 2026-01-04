/**
 * Zustand store for PII Scrubber
 *
 * Manages the application state including:
 * - Raw input text
 * - Sanitized output text
 * - Secret map for reversible sanitization
 * - Scrubbing options (which patterns to apply)
 *
 * Features persistence to localStorage for round-trip restore workflow
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { scrubPII, restorePII, SecretEntry, ScrubberOptions, DEFAULT_OPTIONS } from '@/lib/scrubber';

interface ScrubberState {
  // Text inputs and outputs
  rawInput: string;
  sanitizedOutput: string;
  restoreInput: string;
  restoredOutput: string;

  // Secret map for reversible sanitization (PERSISTED)
  secrets: SecretEntry[];

  // Scrubbing options (PERSISTED)
  options: ScrubberOptions;

  // Actions
  setRawInput: (input: string) => void;
  setRestoreInput: (input: string) => void;
  setOptions: (options: Partial<ScrubberOptions>) => void;
  scrubText: () => void;
  restoreText: () => void;
  clearAll: () => void;
}

/**
 * Zustand store for the PII scrubber application
 * Persists secrets and options to localStorage for round-trip restore workflow
 */
export const useScrubberStore = create<ScrubberState>()(
  persist(
    (set, get) => ({
      // Initial state
      rawInput: '',
      sanitizedOutput: '',
      restoreInput: '',
      restoredOutput: '',
      secrets: [],
      options: { ...DEFAULT_OPTIONS },

      // Actions

      /**
       * Set the raw input text
       */
      setRawInput: (input: string) => {
        set({ rawInput: input });
      },

      /**
       * Set the restore input text (sanitized text to restore)
       */
      setRestoreInput: (input: string) => {
        set({ restoreInput: input });
      },

      /**
       * Update scrubbing options
       */
      setOptions: (newOptions: Partial<ScrubberOptions>) => {
        set((state) => ({
          options: { ...state.options, ...newOptions },
        }));
      },

      /**
       * Scrub the raw input and generate sanitized output
       * Saves secrets to localStorage for future restore
       * Clears any previous restored output
       */
      scrubText: () => {
        const { rawInput, options } = get();
        const { sanitized, secrets } = scrubPII(rawInput, options);
        set({
          sanitizedOutput: sanitized,
          secrets,
          restoreInput: sanitized,
          restoredOutput: '', // Clear previous restored output
        });
      },

      /**
       * Restore the original text using the secret map
       * Works with persisted secrets from localStorage
       * Supports two workflows:
       * 1. Restore from sanitized output (uses sanitizedOutput as primary source)
       * 2. Restore from custom token text (uses rawInput if it contains tokens)
       */
      restoreText: () => {
        const { restoreInput, secrets, rawInput, sanitizedOutput } = get();

        // Check if rawInput contains tokens (for round-trip workflow)
        const rawInputHasTokens = /\[(EMAIL|CC|PHONE|ID)_\d+\]/.test(rawInput);
        
        // Priority: If rawInput has tokens, use it. Otherwise use sanitizedOutput, fallback to restoreInput
        let inputToRestore = rawInputHasTokens ? rawInput : (sanitizedOutput || restoreInput);

        const restored = restorePII(inputToRestore, secrets);
        set({
          restoredOutput: restored,
        });
      },

      /**
       * Clear all text and reset the secret map
       * Also clears localStorage
       */
      clearAll: () => {
        set({
          rawInput: '',
          sanitizedOutput: '',
          restoreInput: '',
          restoredOutput: '',
          secrets: [],
        });
      },
    }),
    {
      name: 'safetylayer-secrets', // localStorage key
      partialize: (state) => ({
        // Only persist secrets and options (not the actual text content)
        secrets: state.secrets,
        options: state.options,
      }),
    }
  )
);
