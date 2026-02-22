# earnrm CRM - Product Requirements Document

## Overview
earnrm - "Your CRM that pAIs you back". AI-powered CRM.

## Access
- **Email**: florian@unyted.world | **Password**: DavidConstantin18

## Technical Stack
React, TailwindCSS, Shadcn UI | FastAPI, Motor, MongoDB | JWT + Google OAuth | Stripe | Resend | GPT-5.2 | Twilio (phone pending)

## Implemented Features
- [x] Full CRM (Leads, Deals, Tasks, Companies, Campaigns, **Contacts**)
- [x] AI: lead scoring, email drafting, smart search, lead summary, call analysis, lead enrichment
- [x] Lead detail/edit, Contact detail/edit with sales fields
- [x] **Deal → Company/Contact/Lead linking** with probability recommendation
- [x] **Contact CSV import + manual creation**
- [x] **Bulk operations** (enrich, update, delete) for leads/contacts/companies
- [x] **Campaign linking** — add leads/contacts to campaigns in bulk
- [x] Lead → Contact conversion (auto-triggered on "qualified")
- [x] Chat archive + collapsible channel sections
- [x] Outbound Calling (Twilio), Call Recording, AI Call Analysis, Call Scheduling
- [x] Team Chat, Invitations, PWA, Affiliate program
- [x] Landing page logo bigger than subheader

## P0 - Requires User Action
- Twilio phone number for live calling

## P2 - Future/Backlog
- Address book sync (OS-level contacts)
- Conversation Intelligence, Deal Forecast AI, AI Chatbot
