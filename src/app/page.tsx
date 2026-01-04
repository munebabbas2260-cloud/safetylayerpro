'use client';

/**
 * SafetyLayer Landing Page
 * 
 * Enterprise-grade landing page with integrated PII sanitization demo
 */

import Link from 'next/link';
import { InputPanel } from '@/components/scrubber/InputPanel';
import { OutputPanel } from '@/components/scrubber/OutputPanel';
import { ControlBar } from '@/components/scrubber/ControlBar';
import { ExampleTemplates } from '@/components/scrubber/ExampleTemplates';
import { StatsDashboard } from '@/components/scrubber/StatsDashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Github, 
  Sun, 
  Moon, 
  Keyboard,
  Shield, 
  Lock, 
  Zap, 
  Database,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Server,
  Eye,
  ArrowRight,
  Code2,
  ShieldAlert,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useScrubberStore } from '@/store/useSecretStore';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrubText, restoreText, rawInput } = useScrubberStore();
  const { toast } = useToast();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to scrub
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (rawInput.trim()) {
          scrubText();
          toast({
            title: 'Keyboard shortcut used',
            description: 'Text scrubbed with Ctrl+Enter',
          });
        }
      }
      // Ctrl/Cmd + Shift + R to restore
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        restoreText();
        toast({
          title: 'Keyboard shortcut used',
          description: 'Text restored with Ctrl+Shift+R',
        });
      }
      // Show shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rawInput, scrubText, restoreText, toast, showShortcuts]);

  const scrollToDemo = () => {
    document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SafetyLayer</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">
                  Open Source PII Firewall
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-9 w-9 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}

              {/* GitHub Link */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white"
                asChild
              >
                <a
                  href="https://github.com/Imran-Ashiq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9"
                >
                  <Github className="h-4 w-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-6xl mx-auto">
            {/* Headline */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-slate-900 dark:text-white">
                Use AI Without
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  the Risk
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                The open-source firewall for your data. Sanitize sensitive PII (Emails, CCs, SSNs) in your browser{' '}
                <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">before</span> sending context to ChatGPT or Claude.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button
                  size="lg"
                  onClick={scrollToDemo}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105"
                >
                  Start Scrubbing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
                  asChild
                >
                  <a href="https://github.com/yourusername/safetylayer" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>

            {/* Visual Split-Screen Demo */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Risky Prompt */}
              <Card className="relative overflow-hidden border-2 border-red-500/30 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm p-6">
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50">
                    <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">RISKY</span>
                  </div>
                </div>
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Before</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Raw data with exposed PII</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-950/50 rounded-lg p-4 font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800">
                  <div className="space-y-2">
                    <p>Contact: john@company.com</p>
                    <p className="text-red-600 dark:text-red-400 font-semibold">Card: 4111-1111-1111-1111</p>
                    <p className="text-red-600 dark:text-red-400 font-semibold">SSN: 123-45-6789</p>
                    <p>Phone: (555) 123-4567</p>
                  </div>
                </div>
              </Card>

              {/* Safe Prompt */}
              <Card className="relative overflow-hidden border-2 border-green-500/30 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm p-6">
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-semibold text-green-700 dark:text-green-400">SAFE</span>
                  </div>
                </div>
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">After</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sanitized with tokens</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-950/50 rounded-lg p-4 font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800">
                  <div className="space-y-2">
                    <p>Contact: <span className="text-blue-600 dark:text-blue-400 font-semibold">[EMAIL-1]</span></p>
                    <p>Card: <span className="text-green-600 dark:text-green-400 font-semibold">[CC-1]</span></p>
                    <p>SSN: <span className="text-cyan-600 dark:text-cyan-400 font-semibold">[SSN-1]</span></p>
                    <p>Phone: <span className="text-purple-600 dark:text-purple-400 font-semibold">[PHONE-1]</span></p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Banner */}
        <section className="border-y border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 backdrop-blur-sm py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-6">
              Trusted by privacy-conscious developers
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-2 text-center">
                <Lock className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">100% Client-Side</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Code2 className="h-8 w-8 text-green-500 dark:text-green-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Open Source Code</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Server className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Zero Database</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Zap className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Offline Capable</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem vs Solution Grid (Bento Style) */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">Why SafetyLayer?</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Stop the data leak before it happens
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 - The Fear */}
              <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-8 hover:border-red-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/50">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Don't Get Fired</h3>
                <p className="text-slate-700 dark:text-slate-400 leading-relaxed">
                  Uploading client data to public LLMs is a <span className="text-red-600 dark:text-red-400 font-semibold">GDPR nightmare</span>. We stop the leak at the source.
                </p>
              </Card>

              {/* Card 2 - The Magic */}
              <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-8 hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/50">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Reversible Context</h3>
                <p className="text-slate-700 dark:text-slate-400 leading-relaxed">
                  Paste sanitized text into AI → Get answer → <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Restore original details instantly</span>.
                </p>
              </Card>

              {/* Card 3 - The Tech */}
              <Card className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-8 hover:border-green-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/50">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Bank-Grade Validation</h3>
                <p className="text-slate-700 dark:text-slate-400 leading-relaxed">
                  We use <span className="text-green-600 dark:text-green-400 font-semibold">Luhn Algorithms</span>, not just Regex, to ensure we catch every valid credit card.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                The Privacy{' '}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Workflow
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Three simple steps to work with AI without leaking sensitive data
              </p>
            </div>

            {/* 3-Step Process */}
            <div className="grid md:grid-cols-3 gap-6 items-center">
              {/* Step 1 */}
              <Card className="relative bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-8 text-center group hover:border-blue-500/50 transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/50">
                    1
                  </div>
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                  <ShieldAlert className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Input</h3>
                <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed">
                  Paste sensitive client data (Emails, CCs, SSNs) into the input panel.
                </p>
              </Card>

              {/* Arrow */}
              <div className="hidden md:flex justify-center -mx-6">
                <ArrowRight className="h-8 w-8 text-slate-400 dark:text-slate-600" />
              </div>

              {/* Step 2 */}
              <Card className="relative bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-8 text-center group hover:border-purple-500/50 transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/50">
                    2
                  </div>
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Scrub</h3>
                <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed">
                  We replace PII with reversible tokens locally in your browser.
                </p>
              </Card>

              {/* Arrow */}
              <div className="hidden md:flex justify-center -mx-6">
                <ArrowRight className="h-8 w-8 text-slate-400 dark:text-slate-600" />
              </div>

              {/* Step 3 */}
              <Card className="relative bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-8 text-center group hover:border-green-500/50 transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/50">
                    3
                  </div>
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-300">
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Restore</h3>
                <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed">
                  Paste the AI response back to reveal original data instantly.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section id="live-demo" className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-4">
                <Sparkles className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Interactive Demo</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                Try It{' '}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Live
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Paste your sensitive data and watch it get sanitized in real-time. Everything runs locally in your browser.
              </p>
            </div>

            {/* Demo Container with Glow Effect */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl -z-10" />
              
              {/* Mac-Style Browser Window */}
              <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-blue-900/20 overflow-hidden">
                {/* Window Header Bar */}
                <div className="bg-slate-100 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                  {/* Traffic Lights */}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                  </div>
                  {/* Window Title */}
                  <div className="flex-1 text-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">SafetyLayer - Live Demo</span>
                  </div>
                  {/* Placeholder for symmetry */}
                  <div className="w-16" />
                </div>

                {/* Window Content */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30">
                {/* Keyboard Shortcuts Help */}
                {showShortcuts && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                      <Keyboard className="h-4 w-4" />
                      Keyboard Shortcuts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/20 rounded text-xs font-mono text-slate-900 dark:text-white">Ctrl</kbd>
                        <span className="text-slate-600 dark:text-slate-400">+</span>
                        <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/20 rounded text-xs font-mono text-slate-900 dark:text-white">Enter</kbd>
                        <span className="text-slate-600 dark:text-slate-400">Scrub PII</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/20 rounded text-xs font-mono text-slate-900 dark:text-white">Ctrl</kbd>
                        <span className="text-slate-600 dark:text-slate-400">+</span>
                        <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/20 rounded text-xs font-mono text-slate-900 dark:text-white">Shift</kbd>
                        <span className="text-slate-600 dark:text-slate-400">+</span>
                        <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-white/20 rounded text-xs font-mono text-slate-900 dark:text-white">R</kbd>
                        <span className="text-slate-600 dark:text-slate-400">Restore</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shortcuts Toggle */}
                <div className="mb-6 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    onClick={() => setShowShortcuts(!showShortcuts)}
                  >
                    <Keyboard className="h-4 w-4" />
                    <span className="text-xs">Keyboard Shortcuts</span>
                  </Button>
                </div>

                {/* Example Templates */}
                <div className="mb-6">
                  <ExampleTemplates />
                </div>

                {/* Statistics Dashboard */}
                <div className="mb-6">
                  <StatsDashboard />
                </div>
                
                 {/* Control Bar */}
                <div className="mb-6">
                  <ControlBar />
                </div>

                {/* Split View Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InputPanel />
                  <OutputPanel />
                </div>

                {/* Legal Disclaimer */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground/60 italic">
                    Security Notice: Processing happens locally in your browser. No data is sent to our servers. Use at your own risk.
                  </p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-slate-900 dark:text-white">SafetyLayer</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Built for developers, by developers.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/Imran-Ashiq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button
                      onClick={scrollToDemo}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Live Demo
                    </button>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Imran-Ashiq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Imran-Ashiq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal & Support */}
              <div>
                <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://buymeacoffee.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Buy Me a Coffee
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Imran-Ashiq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Report Issue
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-200 dark:border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>Your data never leaves your browser. Zero backend, zero risk.</span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  © 2025 SafetyLayer. MIT Licensed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
