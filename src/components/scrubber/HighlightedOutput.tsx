'use client';

/**
 * HighlightedOutput Component
 * 
 * Renders text with syntax highlighting for PII tokens
 * Tokens are color-coded and clickable for easy copying
 */

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HighlightedOutputProps {
  text: string;
  isRestored?: boolean;
}

export function HighlightedOutput({ text, isRestored = false }: HighlightedOutputProps) {
  const { toast } = useToast();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Token color mapping
  const tokenColors: Record<string, { bg: string; text: string; border: string }> = {
    EMAIL: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/30' },
    CC: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' },
    PHONE: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
    ID: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
  };

  const handleCopyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
      toast({
        title: 'Token copied',
        description: `${token} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy token',
        variant: 'destructive',
      });
    }
  };

  // Parse and highlight tokens in the text
  const renderHighlightedText = () => {
    if (isRestored || !text) {
      return <span className="whitespace-pre-wrap">{text}</span>;
    }

    // Regex to match tokens like [EMAIL_1], [CC_1], etc.
    const tokenRegex = /\[(EMAIL|CC|PHONE|ID)_\d+\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(text)) !== null) {
      const token = match[0];
      const tokenType = match[1];
      const colors = tokenColors[tokenType] || tokenColors.EMAIL;

      // Add text before the token
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add the highlighted token
      parts.push(
        <span
          key={`token-${match.index}`}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-semibold text-xs ${colors.bg} ${colors.text} ${colors.border} cursor-pointer hover:scale-105 transition-transform group relative`}
          onClick={() => handleCopyToken(token)}
          title={`Click to copy ${token}`}
        >
          {token}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            {copiedToken === token ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </span>
        </span>
      );

      lastIndex = match.index + token.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{text}</span>;
  };

  return (
    <div className="font-mono text-sm leading-relaxed">
      {renderHighlightedText()}
    </div>
  );
}
