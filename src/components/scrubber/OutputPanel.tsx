'use client';

/**
 * OutputPanel Component
 *
 * Displays the sanitized output with masked PII tokens
 * Shows statistics about what was detected
 * Implements Smart Copy: Automatically prepends AI safety instructions
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileCheck, BadgeCheck, Download, Copy, Check, Info, Sparkles } from 'lucide-react';
import { useScrubberStore } from '@/store/useSecretStore';
import { countPIIByType } from '@/lib/scrubber';
import { Badge } from '@/components/ui/badge';
import { HighlightedOutput } from './HighlightedOutput';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const SMART_COPY_KEY = 'safetylayer-smart-copy-seen';
const SYSTEM_INSTRUCTION = `[System Instruction: The text includes security placeholders such as [EMAIL_1], [PHONE_1], [CC_1], [ID_1].
Your response must include these placeholders exactly as shown.
Do not remove, alter, replace, summarize, or generalize them.
If any placeholder is missing, the response is invalid.]

---

`;

export function OutputPanel() {
  const { sanitizedOutput, restoredOutput, secrets } = useScrubberStore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showSmartCopyModal, setShowSmartCopyModal] = useState(false);
  const [hasSeenSmartCopy, setHasSeenSmartCopy] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const seen = localStorage.getItem(SMART_COPY_KEY);
    setHasSeenSmartCopy(!!seen);
  }, []);

  // Determine what to display: if restored output exists, show it; otherwise show sanitized
  const displayOutput = restoredOutput || sanitizedOutput;
  const isShowingRestored = !!restoredOutput;

  // Count PII by type
  const piiCounts = countPIIByType(secrets);
  const totalDetected = secrets.length;

  /**
   * Smart Copy Logic: Prepends system instructions to sanitized output
   * Shows first-time modal or success toast
   */
  const handleSmartCopy = async (textToCopy: string) => {
    if (!textToCopy) return;

    try {
      // Only prepend system instructions for sanitized output (not restored)
      const finalText = !isShowingRestored 
        ? SYSTEM_INSTRUCTION + textToCopy 
        : textToCopy;

      // Write to clipboard
      await navigator.clipboard.writeText(finalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Handle first-time modal or success toast
      if (!hasSeenSmartCopy && !isShowingRestored) {
        setShowSmartCopyModal(true);
        localStorage.setItem(SMART_COPY_KEY, 'true');
        setHasSeenSmartCopy(true);
      } else {
        toast({
          title: !isShowingRestored ? 'Copied with AI Safety Instructions' : 'Copied to clipboard',
          description: !isShowingRestored 
            ? 'System instructions added to protect your tokens.'
            : `${isShowingRestored ? 'Restored' : 'Sanitized'} output copied successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  /**
   * Handle manual copy events (Ctrl+C / Cmd+C)
   */
  const handleManualCopy = (e: React.ClipboardEvent) => {
    // Only intercept for sanitized output (not restored)
    if (isShowingRestored || !sanitizedOutput) return;

    e.preventDefault();

    // Get selected text or full text
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    const textToCopy = selectedText || sanitizedOutput;

    handleSmartCopy(textToCopy);
  };

  /**
   * Handle copy button click
   */
  const handleCopyButton = () => {
    if (!displayOutput) return;
    handleSmartCopy(displayOutput);
  };

  const handleDownload = () => {
    if (!displayOutput) return;

    const blob = new Blob([displayOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isShowingRestored ? 'restored-output.txt' : 'sanitized-output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download started',
      description: `${isShowingRestored ? 'Restored' : 'Sanitized'} output downloaded successfully.`,
    });
  };

  const handleCopy = async () => {
    if (!displayOutput) return;

    try {
      await navigator.clipboard.writeText(displayOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: 'Copied to clipboard',
        description: `${isShowingRestored ? 'Restored' : 'Sanitized'} output copied successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className={`h-5 w-5 ${isShowingRestored ? 'text-blue-500' : 'text-green-500'}`} />
              {isShowingRestored ? 'Restored Output' : 'Safe Output'}
            </CardTitle>
            <div className="flex items-center gap-2">
              {totalDetected > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <BadgeCheck className="h-3 w-3 text-green-500" />
                  {totalDetected} items detected
                </Badge>
              )}
              {displayOutput && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-500/10"
                        >
                          <Info className="h-3 w-3 text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          <span className="font-semibold">Smart Copy Active:</span> We attach a system instruction to ensure the AI preserves your tokens exactly as they are!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-8 hover:bg-purple-500/10 hover:border-purple-500 transition-all"
                    onClick={handleCopyButton}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 h-8"
                    onClick={handleDownload}
                  >
                    <Download className="h-3 w-3" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6 pt-0 flex flex-col gap-4">
          <div 
            className={`min-h-[400px] p-4 rounded-lg border bg-background/50 overflow-auto ${
              isShowingRestored ? 'border-blue-500/20 bg-blue-500/5' : 'border-green-500/20'
            }`}
            onCopy={handleManualCopy}
          >
          {displayOutput ? (
            <HighlightedOutput text={displayOutput} isRestored={isShowingRestored} />
          ) : (
            <p className="text-sm text-muted-foreground font-mono">
              {isShowingRestored 
                ? "Restored text with original PII values will appear here..."
                : "Sanitized text will appear here...\n\nYou can copy this to share with AI assistants or paste it back to restore the original values."
              }
            </p>
          )}
        </div>
        {isShowingRestored && displayOutput && (
          <div className="flex items-start gap-2 text-xs bg-blue-500/10 border border-blue-500/20 rounded-md px-3 py-2">
            <FileCheck className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-blue-700 dark:text-blue-400">
              Original PII values have been restored. This output contains sensitive data.
            </span>
          </div>
        )}
        {totalDetected > 0 && !isShowingRestored && displayOutput && (
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileCheck className="h-3 w-3" />
              <span>Detected:</span>
            </div>
            {Object.entries(piiCounts).map(([type, count]) => (
              <Badge key={type} variant="outline" className="font-normal">
                {type}: {count}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    {/* Smart Copy First-Time Modal */}
    <Dialog open={showSmartCopyModal} onOpenChange={setShowSmartCopyModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Smart Copy Active!
          </DialogTitle>
          <DialogDescription className="pt-4 text-base">
            We just added safety instructions to your clipboard. This ensures the AI keeps your tokens intact.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted/50 border border-muted rounded-lg p-4 my-2">
          <p className="text-sm font-mono text-muted-foreground leading-relaxed">
            [System Instruction: The text below contains security tokens like [EMAIL_1], [CC_1]. DO NOT remove the brackets...]
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="default"
            onClick={() => setShowSmartCopyModal(false)}
            className="w-full"
          >
            Got it, thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
}
