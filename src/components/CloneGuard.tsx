'use client';

/**
 * CloneGuard Component
 * 
 * Brand protection mechanism that detects unauthorized clones
 * and warns users when running on non-official domains.
 */

import { useEffect } from 'react';

const AUTHORIZED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'safetylayer.vercel.app',
  'safetylayer.com',
];

export function CloneGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentHostname = window.location.hostname;
    const isAuthorized = AUTHORIZED_DOMAINS.some(domain => 
      currentHostname === domain || currentHostname.endsWith(`.${domain}`)
    );

    if (!isAuthorized) {
      // Clear, prominent warning in console
      console.clear();
      
      console.log(
        '%c⚠️ SECURITY WARNING ⚠️',
        'color: #ff0000; font-size: 24px; font-weight: bold; background: #ffff00; padding: 10px; border: 3px solid #ff0000;'
      );
      
      console.log(
        '%cYou are running an UNAUTHORIZED CLONE of SafetyLayer',
        'color: #ff0000; font-size: 16px; font-weight: bold;'
      );
      
      console.table({
        'Current Domain': currentHostname,
        'Official Domain': 'safetylayer.vercel.app',
        'Status': '❌ UNAUTHORIZED',
        'Security Risk': 'This clone may contain malicious code',
        'Data Privacy': 'Your sensitive data may be compromised',
      });
      
      console.log(
        '%c🔒 For your safety, please visit the official version:',
        'color: #0066cc; font-size: 14px; font-weight: bold;'
      );
      
      console.log(
        '%chttps://safetylayer.vercel.app',
        'color: #00cc00; font-size: 18px; font-weight: bold; text-decoration: underline;'
      );
      
      console.log(
        '%c\n📜 Legal Notice:\nThis software is licensed under AGPL-3.0.\nAny modifications must be open-sourced.\nUnauthorized commercial use is prohibited.\n',
        'color: #666666; font-size: 12px;'
      );

      // Optional: Show a subtle banner in the UI (non-intrusive)
      const banner = document.createElement('div');
      banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to right, #ff0000, #cc0000);
        color: white;
        padding: 12px;
        text-align: center;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 600;
        z-index: 999999;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.3);
      `;
      banner.innerHTML = `
        ⚠️ CLONE DETECTED - This is not the official SafetyLayer. 
        <a href="https://safetylayer.vercel.app" 
           style="color: #ffff00; text-decoration: underline; margin-left: 8px;"
           target="_blank">
          Visit Official Site →
        </a>
      `;
      document.body.appendChild(banner);
    }
  }, []);

  return null; // Silent component
}
