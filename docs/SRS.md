# Software Requirements Specification (SRS)
## SafetyLayer: Client-Side PII Sanitization System for AI Workflows

---

**Document Version:** 1.0  
**Date:** January 4, 2026  
**Project Name:** SafetyLayer  
**Prepared By:** Muneeb Abbas  
**Institution:** University Final Year Project Submission  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Proposed Solution](#3-proposed-solution)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Use Cases](#6-use-cases)
7. [System Constraints](#7-system-constraints)
8. [Future Enhancements](#8-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of SafetyLayer, a client-side Personally Identifiable Information (PII) sanitization system designed to protect sensitive data during interactions with Large Language Models (LLMs) and Artificial Intelligence (AI) systems. The document is intended for academic evaluation, technical stakeholders, and future development teams.

### 1.2 Scope

SafetyLayer is a web-based application that operates entirely within the user's browser environment, implementing a zero-trust architecture for data privacy. The system identifies, masks, and subsequently restores sensitive information without requiring server-side processing or network transmission of user data.

**Key Capabilities:**
- Real-time detection of PII patterns (email addresses, credit card numbers, phone numbers, Social Security Numbers)
- Reversible tokenization using cryptographic mapping
- Client-side persistence for cross-session restoration
- Integration with AI workflow pipelines (ChatGPT, Claude, DeepSeek, etc.)

**Out of Scope:**
- Server-side data processing or storage
- Enterprise authentication systems
- Cloud-based synchronization
- Mobile native applications (initial release)

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **PII** | Personally Identifiable Information - Any data that can identify an individual (e.g., email, SSN, credit card) |
| **LLM** | Large Language Model - AI systems like GPT-4, Claude, or DeepSeek that process natural language |
| **DLP** | Data Loss Prevention - Security strategy to prevent unauthorized data exposure |
| **GDPR** | General Data Protection Regulation - EU regulation governing data privacy (2016/679) |
| **HIPAA** | Health Insurance Portability and Accountability Act - US healthcare data protection law |
| **Zero-Trust Architecture** | Security model assuming no implicit trust, requiring verification at every stage |
| **Luhn Algorithm** | Mathematical checksum formula used to validate credit card numbers (ISO/IEC 7812) |
| **SPA** | Single Page Application - Web application architecture that dynamically updates content |
| **Tokenization** | Process of replacing sensitive data with non-sensitive equivalents (tokens) |

### 1.4 Document Conventions

- **Functional Requirements** are denoted as **FR-XX**
- **Non-Functional Requirements** are denoted as **NFR-XX**
- Code examples use TypeScript syntax
- All processing times are measured on modern hardware (2023+ specifications)

---

## 2. Problem Statement

### 2.1 Industry Context

The rapid adoption of AI assistants in professional environments has created a critical security vulnerability. According to industry research, 68% of knowledge workers regularly paste confidential information into AI tools without proper sanitization (Gartner, 2025). This practice exposes organizations to severe compliance violations and data breach risks.

### 2.2 Regulatory Challenges

**GDPR Compliance (Article 32 - Security of Processing):**
Organizations must implement appropriate technical measures to protect personal data. Transmitting PII to third-party AI systems without consent violates Article 5(1)(f) and may incur fines up to €20 million or 4% of annual global turnover.

**HIPAA Requirements (§164.312(a)(1)):**
Healthcare entities transmitting Protected Health Information (PHI) to non-covered entities risk violating the Security Rule, resulting in penalties ranging from $100 to $50,000 per violation.

### 2.3 Technical Vulnerabilities

Traditional approaches to PII sanitization include:

1. **Server-Side Proxies:** Require trust in intermediary services, creating additional attack vectors
2. **Manual Redaction:** Error-prone, time-consuming, and non-scalable
3. **Regex-Only Solutions:** Generate false positives (e.g., treating random 16-digit sequences as credit cards)

### 2.4 Research Gap

Existing Data Loss Prevention (DLP) tools are designed for enterprise environments with centralized control. No open-source, client-side solution exists that:
- Operates offline without network dependencies
- Implements algorithmic validation (not just pattern matching)
- Supports reversible tokenization for AI workflow integration
- Maintains sub-2ms processing latency for real-time use

---

## 3. Proposed Solution

### 3.1 System Architecture: Client-Side Zero-Trust Model

SafetyLayer implements a **browser-based, offline-first architecture** where all data processing occurs within the user's local JavaScript execution environment. The system consists of three primary components:

**A. Scrubber Engine**
- Regex-based pattern detection for PII candidates
- Luhn Algorithm validation for credit card verification
- Token generation with deterministic mapping

**B. State Management Layer**
- Zustand-based reactive store for application state
- LocalStorage persistence for secret mappings
- Session isolation to prevent cross-contamination

**C. User Interface**
- Input panel for raw data entry
- Output panel with syntax highlighting for tokenized text
- Statistics dashboard for transparency and auditing

### 3.2 Workflow Design

The system operates in a three-phase workflow:

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  1. SCRUB   │  →    │  2. SHARE    │  →    │  3. RESTORE │
│  (Detect)   │       │  (AI Query)  │       │  (Reverse)  │
└─────────────┘       └──────────────┘       └─────────────┘
```

**Phase 1: Scrubbing**
- User pastes confidential text containing PII
- Engine detects patterns (email: `john@example.com`, CC: `4111-1111-1111-1111`)
- System generates reversible tokens (`[EMAIL_1]`, `[CC_1]`)
- Secret mapping stored in browser's LocalStorage

**Phase 2: Sharing**
- User copies sanitized text to AI assistant (ChatGPT, Claude)
- AI processes request using tokenized data (e.g., "Send invoice to [EMAIL_1]")
- No PII transmitted to AI provider

**Phase 3: Restoration**
- User pastes AI response back into SafetyLayer
- Fuzzy matching algorithm detects tokens (even if AI modified formatting)
- Original values restored from secret map

### 3.3 Privacy Guarantees

1. **No Network Transmission:** Application runs entirely in browser sandbox (Service Workers for offline capability)
2. **No Telemetry:** `NEXT_TELEMETRY_DISABLED=1` environment variable enforced
3. **No Third-Party Analytics:** Zero external JavaScript dependencies for tracking
4. **Open Source Auditing:** AGPL-3.0 license ensures code transparency

---

## 4. Functional Requirements

### FR-01: Email Address Detection
**Description:** The system shall detect and tokenize email addresses conforming to RFC 5322 standards.

**Input:** Text containing email patterns (e.g., `user.name+tag@domain.co.uk`)  
**Output:** Tokenized representation (e.g., `[EMAIL_1]`)  
**Validation:** Regex pattern `/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g`  
**Priority:** High

---

### FR-02: Credit Card Number Detection with Luhn Validation
**Description:** The system shall detect credit card numbers (13-19 digits) and validate them using the Luhn Algorithm to eliminate false positives.

**Algorithm Specification:**
```
Luhn Check (Modulus 10):
1. Remove all non-digit characters
2. Reverse the digit sequence
3. For every second digit (starting from rightmost), multiply by 2
4. If result > 9, subtract 9
5. Sum all digits
6. If sum % 10 == 0, card is valid
```

**Supported Formats:**
- Consecutive digits: `4532123456789010`
- Hyphenated: `4532-1234-5678-9010`
- Spaced: `4532 1234 5678 9010`

**Priority:** Critical

---

### FR-03: Phone Number Detection (US & International)
**Description:** The system shall detect phone numbers in multiple formats including US domestic and international standards.

**Supported Patterns:**
- US: `(123) 456-7890`, `123-456-7890`, `1234567890`
- International: `+1-123-456-7890`, `+44 20 7123 4567`

**Priority:** High

---

### FR-04: Social Security Number (SSN) Detection
**Description:** The system shall detect US Social Security Numbers in standard format.

**Pattern:** `XXX-XX-XXXX`, `XXX XX XXXX`, `XXXXXXXXX`  
**Validation:** 9 digits with optional hyphens/spaces  
**Priority:** High

---

### FR-05: Token Reversibility (Deterministic Mapping)
**Description:** The system shall maintain a bidirectional mapping between tokens and original values to support restoration.

**Requirements:**
- Identical PII values must generate identical tokens (e.g., two instances of `john@example.com` both become `[EMAIL_1]`)
- Secret map persisted to LocalStorage with session isolation
- Token format: `[TYPE_INDEX]` (e.g., `[EMAIL_1]`, `[CC_2]`)

**Priority:** Critical

---

### FR-06: Fuzzy Token Restoration
**Description:** The system shall restore tokens even if AI systems modify formatting (e.g., removing brackets, changing case).

**Matching Rules:**
- Detect `EMAIL_1`, `[EMAIL_1]`, `(EMAIL_1)`, `**EMAIL_1**`
- Case-insensitive matching
- Preserve surrounding context during replacement

**Example:**
```
AI Output:  "Send invoice to email_1 and cc_1"
Restored:   "Send invoice to john@example.com and support@example.com"
```

**Priority:** High

---

### FR-07: User-Configurable Pattern Toggles
**Description:** Users shall be able to enable/disable specific PII detection patterns via UI controls.

**Options:**
- Email detection (ON/OFF)
- Credit card detection (ON/OFF)
- Phone number detection (ON/OFF)
- SSN detection (ON/OFF)

**Default:** All patterns enabled

**Priority:** Medium

---

### FR-08: Statistics Dashboard
**Description:** The system shall display real-time statistics on detected PII for transparency and auditing.

**Metrics:**
- Total items protected (count)
- Unique PII types detected
- Characters scanned
- Processing speed (<1ms display)

**Priority:** Medium

---

### FR-09: Example Templates for Testing
**Description:** The system shall provide pre-populated templates demonstrating common use cases.

**Templates:**
1. Customer Support Ticket (Email, Phone, SSN)
2. Employee Record (Email, SSN, Credit Card)
3. Financial Report (Credit Cards, Account Numbers)

**Priority:** Low

---

### FR-10: Clone Detection & Brand Protection
**Description:** The system shall detect unauthorized domain deployments and warn users.

**Behavior:**
- Verify domain against whitelist (`safetylayer.com`, `*.vercel.app`, `localhost`)
- Display console warning if unauthorized
- Notify user of potential security risks

**Priority:** Medium

---

## 5. Non-Functional Requirements

### NFR-01: Performance - Sub-2ms Processing Latency
**Specification:** The scrubbing engine shall process text inputs in less than 2 milliseconds for inputs up to 10,000 characters.

**Measurement:** Client-side `performance.now()` instrumentation  
**Target Hardware:** Intel i5 or equivalent (2023+ specs)  
**Justification:** Real-time feedback essential for user experience

---

### NFR-02: Privacy - Offline-First Architecture
**Specification:** The system shall function without network connectivity after initial page load.

**Implementation:**
- Next.js static export (`output: 'standalone'`)
- Service Worker caching for offline capability
- Zero external API calls during operation

**Verification:** Network throttling tests (DevTools)

---

### NFR-03: Compatibility - Modern Browser Support
**Specification:** The system shall support browsers released within the last 2 years.

**Minimum Versions:**
- Chrome/Edge: 120+
- Firefox: 115+
- Safari: 16.4+

**Required Features:**
- ES2022 JavaScript
- LocalStorage API
- CSS Grid/Flexbox

---

### NFR-04: Scalability - Large Text Handling
**Specification:** The system shall handle inputs up to 50,000 characters without performance degradation.

**Stress Test Cases:**
- 10,000 chars: <2ms
- 25,000 chars: <5ms
- 50,000 chars: <10ms

---

### NFR-05: Usability - Accessibility Compliance
**Specification:** The system shall meet WCAG 2.1 Level AA standards.

**Requirements:**
- Keyboard navigation support
- ARIA labels for screen readers
- Minimum contrast ratio 4.5:1
- Focus indicators for interactive elements

---

### NFR-06: Maintainability - Code Quality Standards
**Specification:** The codebase shall maintain test coverage above 80% and adhere to ESLint/TypeScript strict mode.

**Metrics:**
- Unit tests for Luhn algorithm
- Integration tests for scrub/restore round-trip
- E2E tests for UI workflows

---

### NFR-07: Security - Data Isolation
**Specification:** The system shall prevent cross-site scripting (XSS) and ensure data isolation.

**Protections:**
- Content Security Policy (CSP) headers
- Input sanitization for display
- LocalStorage namespacing per session

---

## 6. Use Cases

### Use Case 1: Healthcare Professional Consulting AI

**Actor:** Medical researcher  
**Precondition:** User has patient data requiring HIPAA compliance  
**Main Flow:**
1. User pastes patient record containing email, phone, SSN
2. System detects PII and replaces with tokens
3. User copies sanitized text to ChatGPT for medical coding assistance
4. AI provides ICD-10 codes using tokenized data
5. User pastes AI response back to SafetyLayer
6. System restores original patient identifiers

**Postcondition:** Original data retrieved without HIPAA violation  
**Alternative Flow:** If user disables SSN detection, system skips SSN scrubbing

---

### Use Case 2: Financial Analyst Querying LLM

**Actor:** Corporate financial analyst  
**Precondition:** User has transaction logs with credit card numbers  
**Main Flow:**
1. User pastes CSV data with credit card transactions
2. System validates cards using Luhn algorithm (ignores invalid sequences)
3. User asks AI to summarize spending patterns using `[CC_1]`, `[CC_2]`
4. AI generates report with tokenized identifiers
5. User restores tokens to generate final report with actual card numbers

**Postcondition:** PCI-DSS compliance maintained throughout process

---

### Use Case 3: Customer Support Representative

**Actor:** Support agent  
**Precondition:** User has customer complaint email with PII  
**Main Flow:**
1. User pastes email thread containing customer email and phone
2. System scrubs PII
3. User asks AI to draft professional response using tokens
4. AI generates response template
5. User restores customer details and sends email

**Postcondition:** GDPR Article 32 compliance ensured

---

## 7. System Constraints

### 7.1 Technical Constraints
- **Browser Dependency:** Requires JavaScript-enabled browser with ES2022 support
- **LocalStorage Limits:** Maximum 5-10MB storage per domain (browser-specific)
- **No Encryption:** Tokens stored in plaintext in LocalStorage (acceptable for local-only storage)

### 7.2 Regulatory Constraints
- **Data Residency:** All processing must occur client-side to comply with EU GDPR territorial scope
- **Audit Trail:** No server-side logging creates challenges for enterprise compliance auditing

### 7.3 Operational Constraints
- **Offline Dependency:** Initial page load requires network access
- **Session Isolation:** Clearing browser data destroys secret mappings

---

## 8. Future Enhancements

### 8.1 Planned Features (Roadmap)
1. **Custom Pattern Builder:** Allow users to define organization-specific PII patterns (e.g., employee IDs)
2. **Encryption Layer:** Implement AES-256 encryption for LocalStorage data
3. **Export/Import Functionality:** Download secret mappings as encrypted JSON
4. **Browser Extension:** Chrome/Firefox extensions for context menu integration
5. **Enterprise SSO:** OAuth2 integration for corporate deployment
6. **Multi-Language Support:** Internationalization for EU/Asian markets

### 8.2 Research Opportunities
- **Machine Learning Enhancement:** Train custom NER models for domain-specific PII
- **Blockchain Verification:** Immutable audit logs for compliance documentation
- **Quantum-Resistant Encryption:** Future-proof cryptographic standards

---

## Conclusion

SafetyLayer addresses a critical gap in AI workflow security by providing a transparent, auditable, and privacy-preserving solution for PII sanitization. The system's client-side architecture ensures compliance with modern data protection regulations while maintaining usability for non-technical users. This SRS document serves as the foundation for academic evaluation and future development efforts.

---

**Document Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Lead | [Name] | _________ | Jan 4, 2026 |
| Technical Architect | [Name] | _________ | Jan 4, 2026 |
| Academic Supervisor | [Name] | _________ | Jan 4, 2026 |

---

**References:**

1. European Parliament. (2016). *General Data Protection Regulation (GDPR)*. Regulation (EU) 2016/679.
2. ISO/IEC 7812-1:2017. *Identification cards — Identification of issuers — Part 1: Numbering system*.
3. NIST Special Publication 800-122. *Guide to Protecting the Confidentiality of Personally Identifiable Information (PII)*.
4. Gartner Research. (2025). *Market Guide for Data Loss Prevention*.
5. OWASP Foundation. (2024). *Top 10 Web Application Security Risks*.
