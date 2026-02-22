# earnrm CRM - Product Requirements Document

## Overview
earnrm - "Your CRM that pAIs you back". AI-powered CRM.

## Access
- **Email**: florian@unyted.world | **Password**: DavidConstantin18

## Roles
- **super_admin**: Full access + Data Explorer + Discount codes
- **deputy_admin**: Same as super_admin
- **support**: Support request management
- **owner/admin/member**: Organization-level roles

## Implemented Features
- [x] Full CRM (Leads, Deals, Tasks, Companies, Campaigns, Contacts)
- [x] AI: scoring, email, search, summary, call analysis, enrichment
- [x] **Deals: Kanban ↔ List view toggle** with select all + bulk delete
- [x] **Select All** for Leads, Contacts, Deals (works with filters)
- [x] **Data Explorer** — Super Admin can browse all MongoDB collections with search + pagination
- [x] **Admin access restricted** — Only super_admin/deputy_admin see Admin in sidebar
- [x] Bulk operations (enrich, update, delete, campaign linking)
- [x] Lead → Contact conversion, Contact CSV import, manual creation
- [x] Deal → Company/Contact/Lead linking
- [x] Chat archive, collapsible channels
- [x] Calling, Recording, AI Analysis, Scheduling
- [x] Team Chat, Invitations, PWA, Affiliate program
- [x] Auto-Lead from signups, affiliate referral tracking
- [x] Column visibility, support management, role management

## P0 - Requires User Action
- Twilio phone number for live calling

## P2 - Future/Backlog
- Conversation Intelligence, Deal Forecast AI, AI Chatbot
