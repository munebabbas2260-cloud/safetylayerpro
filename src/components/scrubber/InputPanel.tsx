'use client';

/**
 * InputPanel Component
 *
 * Provides a textarea for users to input raw text containing sensitive PII
 * Also supports restore mode when user pastes text containing tokens
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Lock, FileText, Unlock } from 'lucide-react';
import { useScrubberStore } from '@/store/useSecretStore';
import { useToast } from '@/hooks/use-toast';

const MAX_CHARACTERS = 100000;

export function InputPanel() {
  const { rawInput, setRawInput, secrets } = useScrubberStore();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (newValue.length > MAX_CHARACTERS) {
      toast({
        variant: "destructive",
        title: "Input too large",
        description: "Please limit to 100k characters to prevent browser freezing.",
      });
      return;
    }
    
    setRawInput(newValue);
  };

  const characterCount = rawInput?.length || 0;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.9; // 90% threshold

  // Check if there are persisted secrets available for restore
  const hasPersistedSecrets = secrets && secrets.length > 0;
  const inputHasTokens = rawInput && /\[(EMAIL|CC|PHONE|ID)_\d+\]/.test(rawInput);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-500" />
            Raw Input
          </div>
          <span className={`text-xs font-mono ${isNearLimit ? 'text-orange-500' : 'text-muted-foreground'}`}>
            {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-6 pt-0">
        <Textarea
          placeholder={hasPersistedSecrets
            ? "Paste text containing tokens (e.g., [EMAIL_1]) here to reveal original data...&#10;&#10;Or paste new sensitive data to scrub."
            : "Paste your sensitive data here...&#10;&#10;Example:&#10;Contact John at john.doe@example.com or call (123) 456-7890.&#10;SSN: 123-45-6789&#10;Card: 4111-1111-1111-1111"
          }
          value={rawInput}
          onChange={handleInputChange}
          className="min-h-[400px] font-mono text-sm resize-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="mt-3 space-y-2">
          {hasPersistedSecrets && inputHasTokens && (
            <div className="flex items-start gap-2 text-xs bg-green-500/10 border border-green-500/20 rounded-md px-3 py-2">
              <Unlock className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-green-700 dark:text-green-400">
                Restore mode: Tokens in this input will be replaced with original values
              </span>
            </div>
          )}
          {hasPersistedSecrets && !inputHasTokens && (
            <div className="flex items-start gap-2 text-xs bg-blue-500/10 border border-blue-500/20 rounded-md px-3 py-2">
              <Unlock className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="text-blue-700 dark:text-blue-400">
                Clicking "Restore" will restore the Safe Output (right panel) with original values
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>Your data stays in your browser</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
