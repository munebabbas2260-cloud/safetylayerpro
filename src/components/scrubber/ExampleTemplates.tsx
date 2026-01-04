'use client';

/**
 * ExampleTemplates Component
 * 
 * Provides quick example templates for users to try the scrubber
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Sparkles, MessageSquare, User, DollarSign, Heart } from 'lucide-react';
import { useScrubberStore } from '@/store/useSecretStore';
import { useToast } from '@/hooks/use-toast';

const EXAMPLE_TEMPLATES = [
  {
    id: 'customer-support',
    name: 'Customer Support',
    icon: MessageSquare,
    emoji: '💬',
    gradient: 'from-blue-500 to-cyan-500',
    content: `Customer Support Ticket #12345

Customer: John Smith
Email: john.smith@techcorp.com
Phone: (555) 123-4567
Account: Premium Business

Issue: Unable to process payment
Payment Method: Card ending in 4532 (Full: 4532-1234-5678-9010)
SSN (for verification): 123-45-6789

Please expedite resolution.`,
  },
  {
    id: 'employee-record',
    name: 'Employee Record',
    icon: User,
    emoji: '👤',
    gradient: 'from-purple-500 to-pink-500',
    content: `EMPLOYEE CONFIDENTIAL RECORD

Name: Sarah Johnson
Email: sarah.johnson@company.com
Personal Email: sarahj@gmail.com
Mobile: +1-555-987-6543
SSN: 987-65-4321
Emergency Contact: (555) 246-8135

Credit Card on File: 5555-5555-5555-4444
Department: Engineering
Clearance: Level 4`,
  },
  {
    id: 'financial-report',
    name: 'Financial Data',
    icon: DollarSign,
    emoji: '💰',
    gradient: 'from-green-500 to-emerald-500',
    content: `Q4 FINANCIAL SUMMARY

Client: michael.chen@startup.io
Transaction #: TRX-2025-001
Amount: $125,000.00

Payment Cards:
- Primary: 3782-822463-10005
- Backup: 6011-1111-1111-1117

Contact: +1 (555) 789-0123
Tax ID: 456-78-9012

Status: APPROVED`,
  },
  {
    id: 'medical-record',
    name: 'Medical Info',
    icon: Heart,
    emoji: '🏥',
    gradient: 'from-red-500 to-orange-500',
    content: `PATIENT MEDICAL RECORD

Patient: Dr. Emily Watson
DOB: 05/15/1985
SSN: 234-56-7890
Contact: emily.watson@healthmail.com
Phone: (555) 321-9876

Insurance Card: 4111-1111-1111-1111
Member ID: MED-789012

Emergency: +1-555-456-7890
Notes: Annual checkup scheduled`,
  },
];

export function ExampleTemplates() {
  const { setRawInput, clearAll } = useScrubberStore();
  const { toast } = useToast();

  const handleLoadExample = (template: typeof EXAMPLE_TEMPLATES[0]) => {
    clearAll(); // Clear any existing data
    setRawInput(template.content);
    toast({
      title: '✅ Example loaded',
      description: `${template.name} template loaded. Click "Scrub PII" to sanitize.`,
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 border-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-md">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Try Example Templates</h3>
          <p className="text-xs text-muted-foreground">Click to load sample data with PII</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {EXAMPLE_TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <Button
              key={template.id}
              variant="outline"
              size="lg"
              className={`h-auto flex-col gap-3 py-5 hover:scale-105 transition-all duration-300 border-2 hover:border-transparent relative overflow-hidden group`}
              onClick={() => handleLoadExample(template)}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Text */}
              <div className="relative text-center">
                <span className="text-sm font-semibold block">{template.name}</span>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-blue-500" />
          <span>Each template contains realistic PII data for testing. Your data never leaves your browser.</span>
        </p>
      </div>
    </Card>
  );
}
