# earnrm CRM - Product Requirements Document

## Overview
earnrm - "Your CRM that pAIs you back". AI-powered CRM for lead management, deal pipeline, team collaboration.

## Access
- **Email**: florian@unyted.world | **Password**: DavidConstantin18

## Technical Stack
- React, TailwindCSS, Shadcn UI | FastAPI, Motor, MongoDB
- JWT (7-day) + Google OAuth | Stripe | Resend | GPT-5.2 | Twilio (phone pending)

## Implemented Features
- [x] Full CRM (Leads, Deals, Tasks, Companies, Campaigns)
- [x] AI: lead scoring, email drafting, smart search, lead summary, call analysis, lead enrichment
- [x] Lead detail/edit dialog with all fields
- [x] **Contacts** — Rich profiles converted from qualified leads (budget, timeline, decision maker, pain points)
- [x] **Lead → Contact conversion** with deal linking, auto-triggered on "qualified" status
- [x] **Chat archive** — Admins can archive channels; collapsible sidebar sections (fold/unfold)
- [x] **View Lead from chat** — Navigates to specific lead detail (not just /leads)
- [x] Task assignment to team members with admin visibility + owner filter
- [x] Multi-user orgs, role management, customizable pipelines
- [x] Affiliate program with HTML embed code + 3 social media assets
- [x] Real-time Team Chat with contextual channels (Lead/Deal)
- [x] Team Invitations (Link, Email, CSV)
- [x] PWA Mobile App (Settings > Mobile App tab)
- [x] Outbound Calling (Twilio), Call Recording, AI Call Analysis
- [x] Call Scheduling (calendar, reminders)
- [x] Google OAuth JWT token fix, 7-day session persistence
- [x] Stripe cancel redirect fix

## P0 - Requires User Action
- Twilio phone number for live calling

## P2 - Future/Backlog
- Conversation Intelligence, Deal Forecast AI, AI Chatbot
