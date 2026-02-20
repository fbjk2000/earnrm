# earnrm CRM - Product Requirements Document

## Overview
earnrm is an AI-powered CRM with the slogan "Your CRM that pAIs you back". Features automated lead generation, LinkedIn data collection, and email marketing. Designed to run marketing and sales departments with simplicity and teamwork focus.

## Brand Guidelines
- **Primary Color**: #A100FF (Earnrm Purple)
- **Black**: #111111
- **Dark Background**: #0B0B0B
- **Gray**: #444444
- **Font**: Inter (primary), Lato (fallback)
- **Slogan**: "Your CRM that pAIs you back" (AI highlighted in purple)

## Logo Assets
- Horizontal logo: https://customer-assets.emergentagent.com/job_leadhub-app-2/artifacts/u9efkh3m_earnrm_logo_horizontal_light_notag_purpleword.png
- With tagline: https://customer-assets.emergentagent.com/job_leadhub-app-2/artifacts/vhcjdzuc_earnrm_logo_horizontal_light_tagline_purpleword.png

## Access Information

### Super Admin Access
- **Email**: florian@unyted.world
- **Password**: DavidConstantin18
- **Role**: Super Admin (full system access)

### Backend API
- **Base URL**: /api
- **Health Check**: /api/ returns "earnrm CRM API"

## Technical Stack
- Frontend: React, TailwindCSS, Shadcn UI
- Backend: FastAPI (Python), Motor
- Database: MongoDB
- Auth: JWT + Emergent Google OAuth
- Payments: Stripe
- Email: Resend
- AI: OpenAI GPT-5.2 via Emergent LLM Key
- Calling: Twilio (configured via env vars)

## What's Been Implemented
- [x] Full CRM functionality (Leads, Deals, Tasks, Companies, Campaigns)
- [x] AI-powered lead scoring and email drafting
- [x] Smart Search, AI Email Drafting, Lead Summary Generation
- [x] Multi-user organizations with role management
- [x] Customizable deal pipeline stages per organization
- [x] Affiliate self-enrollment system
- [x] Support page with FAQ and contact form
- [x] Complete rebrand to earnrm (Feb 2026)
- [x] Real-time Team Chat with channels, mentions, reactions
- [x] Contextual Chat (Lead/Deal discussion channels)
- [x] Team Invitations (Link, Email, CSV)
- [x] **PWA Mobile App (Feb 20, 2026)**:
  - manifest.json with app metadata, icons (192x192, 512x512)
  - Service worker for offline caching
  - Install prompt capture (beforeinstallprompt)
  - Landing page updated with PWA install section
  - Works on iOS, Android, and desktop
- [x] **Outbound Calling & AI Analysis (Feb 20, 2026)**:
  - Twilio integration for outbound calls with recording
  - Calls page with stats dashboard (Total, Completed, Avg Duration, AI Analyzed)
  - New Call dialog with lead selector and opening message
  - Call history with search and filtering
  - Call detail view with recording player
  - AI call analysis (summary, score, strengths, improvements, next steps)
  - Twilio webhooks for call status and recording status updates
  - "Call Lead" option in Leads page dropdown
  - Graceful handling when Twilio not configured (503 with helpful message)

## Integrations
- Resend (Email - domain: earnrm.com pending verification)
- Kit.com (Email Marketing)
- Stripe (Payments)
- Emergent LLM Key (AI features - GPT-5.2)
- Twilio (Outbound Calling - requires user credentials)

## P0 - Requires User Action
- Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_FROM) need to be configured
- DNS/Domain routing for earnrm.com (user confirmed resolved)
- Resend email domain verification

## P1 - Upcoming Features
- Call recording and analytics with AI-based feedback (UI built, needs Twilio keys to test)
- Outbound call service full workflow testing

## P2 - Future/Backlog
- AI-Powered Lead Enrichment (LinkedIn data)
- Conversation Intelligence (call recordings transcription)
- Deal Forecast AI
- AI Chatbot for website
