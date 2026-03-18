# earnrm — Your CRM that pAIs you back

<p align="center">
  <img src="https://customer-assets.emergentagent.com/job_leadhub-app-2/artifacts/u9efkh3m_earnrm_logo_horizontal_light_notag_purpleword.png" alt="earnrm" height="60" />
</p>

<p align="center">
  <strong>AI-powered CRM for lead management, deal pipeline, team collaboration & outbound calling</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#integrations">Integrations</a>
</p>

---

## Features

### Core CRM
- **Leads** — Import via CSV, manual creation, AI enrichment, AI scoring, bulk operations
- **Contacts** — Convert from qualified leads, rich profiles with sales fields (budget, timeline, decision maker)
- **Deals** — Kanban pipeline with drag-and-drop, list view, stage management, entity linking
- **Tasks** — Kanban board with assignee management, admin visibility, due dates
- **Companies** — Target company management with industry, size, and contact tracking
- **Campaigns** — Email campaigns via Resend, Kit.com integration, AI-powered drafting

### AI Features (GPT-5.2)
- **Lead Scoring** — AI analyzes lead data and assigns a 1-100 quality score
- **Lead Enrichment** — Fills in missing company info, tech stack, interests, and recommended approach
- **Email Drafting** — AI-generated personalized sales emails with tone and purpose selection
- **Lead Summary** — Comprehensive AI analysis of lead profiles
- **Smart Search** — Natural language search across all CRM data
- **Call Analysis** — AI feedback on recorded calls with score, strengths, and next steps

### Communication
- **Outbound Calling** — Twilio integration for making calls directly from the CRM
- **Inbound Calls** — Auto-greeting, voicemail recording, caller identification
- **Call Scheduling** — Calendar-based scheduling with configurable reminders
- **Team Chat** — Real-time messaging with channels, contextual discussions (per lead/deal)
- **Chat Archive** — Admins can archive channels, collapsible sidebar sections

### Platform
- **Multi-tenant Organizations** — Role-based access (member, admin, owner, deputy_admin, support, super_admin)
- **Auto Org Attribution** — Users with company emails auto-join matching organizations
- **Team Invitations** — Invite via link, email, or CSV import
- **Affiliate Program** — HTML embed codes, social media assets, commission tracking
- **PWA** — Installable as an app on iOS, Android, and desktop
- **API Keys & Webhooks** — Programmatic access for n8n, Notion, and custom integrations
- **Subscription & Billing** — Stripe integration with discount codes and invoicing

### Admin Dashboard
- **User Analytics** — Signups, last login, org membership, role management
- **Data Explorer** — Browse all MongoDB collections with search and pagination
- **Support Management** — Track and resolve support requests
- **Organization Management** — Edit orgs, set license limits, delete users/orgs

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Shadcn/UI, @hello-pangea/dnd |
| Backend | Python, FastAPI, Motor (async MongoDB) |
| Database | MongoDB |
| Auth | JWT (7-day expiry) + Emergent Google OAuth |
| AI | OpenAI GPT-5.2 via Emergent Integrations |
| Email | Resend (primary), Kit.com (optional) |
| Payments | Stripe |
| Calling | Twilio Voice API |
| Hosting | Emergent Platform (Kubernetes) |

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB
- Yarn

### Environment Variables

**Backend** (`/backend/.env`):
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="earnrm_db"
JWT_SECRET="your_secret_key"
JWT_ALGORITHM="HS256"
JWT_EXPIRY_HOURS=168
EMERGENT_LLM_KEY="your_emergent_key"
RESEND_API_KEY="your_resend_key"
SENDER_EMAIL="noreply@earnrm.com"
KIT_API_KEY="your_kit_key"
KIT_API_SECRET=""
STRIPE_API_KEY="your_stripe_key"
SUPER_ADMIN_EMAIL="admin@yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
TWILIO_ACCOUNT_SID="your_twilio_sid"
TWILIO_AUTH_TOKEN="your_twilio_token"
TWILIO_PHONE_FROM="+1234567890"
```

**Frontend** (`/frontend/.env`):
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

### Installation

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend
cd frontend
yarn install
yarn start
```

### First-Time Setup

1. Start the app and navigate to the signup page
2. Register with the email matching `SUPER_ADMIN_EMAIL`
3. Visit `/admin` to set up your super admin password via `POST /api/admin/setup-super-admin`

---

## API Reference

### Authentication

All API requests require authentication via one of:
- **JWT Token**: `Authorization: Bearer <token>`
- **API Key**: `X-API-Key: earnrm_<key>` (for external integrations)

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}

# Response: { "user_id", "email", "name", "organization_id", "role", "token" }
```

#### Google OAuth
```bash
POST /api/auth/session
Content-Type: application/json

{ "session_id": "<session_id_from_oauth_redirect>" }
# Response: { "user_id", "email", "name", "token" }
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Leads

#### List Leads
```bash
GET /api/leads?status=new&source=manual
Authorization: Bearer <token>
```

#### Create Lead
```bash
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@company.com",
  "phone": "+44123456789",
  "company": "Acme Corp",
  "job_title": "CTO",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "source": "manual"
}
```

#### Update Lead
```bash
PUT /api/leads/{lead_id}
Authorization: Bearer <token>
Content-Type: application/json

{ "status": "qualified", "notes": "Interested in enterprise plan" }
```

#### Delete Lead
```bash
DELETE /api/leads/{lead_id}
Authorization: Bearer <token>
```

#### Import Leads from CSV
```bash
POST /api/leads/import-csv
Authorization: Bearer <token>
Content-Type: multipart/form-data

# CSV columns: first_name, last_name, email, phone, company, job_title, linkedin_url, source
```

#### Convert Lead to Contact
```bash
POST /api/leads/{lead_id}/convert-to-contact?deal_id=optional_deal_id
Authorization: Bearer <token>
```

---

### Contacts

#### List Contacts
```bash
GET /api/contacts
Authorization: Bearer <token>
```

#### Create Contact
```bash
POST /api/contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@corp.com",
  "phone": "+44987654321",
  "company": "Corp Inc",
  "job_title": "VP Sales",
  "decision_maker": true,
  "budget": "€50,000",
  "timeline": "Q2 2026",
  "pain_points": "Manual lead tracking"
}
```

#### Import Contacts from CSV
```bash
POST /api/contacts/import-csv
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

---

### Deals

#### List Deals
```bash
GET /api/deals?stage=qualified&tag=enterprise&assigned_to=user_id
Authorization: Bearer <token>
```

#### Create Deal
```bash
POST /api/deals
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Enterprise License",
  "value": 50000,
  "currency": "EUR",
  "stage": "qualified",
  "probability": 60,
  "lead_id": "lead_xxx",
  "contact_id": "contact_xxx",
  "company_id": "company_xxx",
  "tags": ["enterprise", "q2"],
  "notes": "Decision expected by end of month",
  "task_title": "Follow up call",
  "task_owner_id": "user_xxx"
}
```

Stages: `lead` → `qualified` → `proposal` → `negotiation` → `won` / `lost`

> **Note**: Lost deals are excluded from pipeline value calculations.

#### Update Deal Stage
```bash
PUT /api/deals/{deal_id}
Content-Type: application/json

{ "stage": "won", "probability": 100 }
```

#### Delete Deal
```bash
DELETE /api/deals/{deal_id}
Authorization: Bearer <token>
```

---

### AI Features

#### Score Lead
```bash
POST /api/ai/score-lead/{lead_id}
Authorization: Bearer <token>

# Response: { "lead_id", "ai_score": 75 }
```

#### Enrich Lead
```bash
POST /api/ai/enrich-lead/{lead_id}
Authorization: Bearer <token>

# Response: { "lead_id", "enrichment": { "company_description", "industry", "technologies", "interests", "recommended_approach" }, "lead": {...} }
```

#### Draft Email
```bash
POST /api/ai/draft-email?lead_id=xxx&purpose=introduction&tone=professional
Authorization: Bearer <token>

# Purposes: introduction, follow_up, proposal, check_in, meeting_request, thank_you
# Tones: professional, friendly, casual, formal
# Response: { "subject", "content", "lead_name", "purpose", "tone" }
```

#### Smart Search
```bash
GET /api/ai/search?q=enterprise+deals+closing+this+month
Authorization: Bearer <token>
```

---

### Calls

#### Initiate Outbound Call
```bash
POST /api/calls/initiate
Authorization: Bearer <token>
Content-Type: application/json

{ "lead_id": "lead_xxx", "message": "Thanks for your interest" }
```

#### Schedule Call
```bash
POST /api/calls/schedule
Authorization: Bearer <token>
Content-Type: application/json

{
  "lead_id": "lead_xxx",
  "scheduled_at": "2026-03-15T14:00:00Z",
  "notes": "Discuss pricing",
  "reminder_minutes": 15
}
```

#### List Calls
```bash
GET /api/calls?lead_id=optional_filter
Authorization: Bearer <token>
```

#### AI Call Analysis
```bash
POST /api/calls/{call_id}/analyze
Authorization: Bearer <token>

# Response: { "analysis": { "summary", "sentiment", "score", "strengths", "improvements", "next_steps" } }
```

#### Twilio Webhooks
- **Inbound calls**: `POST /api/webhooks/twilio/inbound`
- **Call status**: `POST /api/webhooks/twilio/call-status`
- **Recording status**: `POST /api/webhooks/twilio/recording-status`

---

### Bulk Operations

#### Bulk Delete
```bash
POST /api/bulk/delete
Content-Type: application/json

{ "entity_type": "lead", "entity_ids": ["lead_xxx", "lead_yyy"] }
# entity_type: lead, contact, company, deal
```

#### Bulk Update
```bash
POST /api/bulk/update
Content-Type: application/json

{ "entity_type": "lead", "entity_ids": ["lead_xxx"], "updates": { "status": "contacted" } }
```

#### Bulk Enrich
```bash
POST /api/bulk/enrich
Content-Type: application/json

{ "entity_type": "lead", "entity_ids": ["lead_xxx", "lead_yyy"] }
```

#### Add to Campaign
```bash
POST /api/bulk/add-to-campaign
Content-Type: application/json

{ "campaign_id": "camp_xxx", "entity_type": "lead", "entity_ids": ["lead_xxx"] }
```

---

### External API (v1)

These endpoints use API key authentication for external integrations.

```bash
# Header: X-API-Key: earnrm_your_key_here
```

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/leads` | GET | List leads (params: limit, status) |
| `/api/v1/leads` | POST | Create lead |
| `/api/v1/contacts` | GET | List contacts |
| `/api/v1/deals` | GET | List deals (params: limit, stage) |
| `/api/v1/companies` | GET | List companies |
| `/api/v1/tasks` | GET | List tasks (params: limit, status) |
| `/api/v1/notion/sync` | POST | Get Notion-formatted data (params: entity_type) |
| `/api/v1/docs` | GET | API documentation |

#### Generate API Key
```bash
POST /api/api-keys?name=my_integration
Authorization: Bearer <token>

# Response: { "key": "earnrm_abc123...", "key_id": "key_xxx" }
# ⚠️ Save the key immediately — it won't be shown again
```

---

### Webhooks

Register webhook URLs to receive real-time event notifications.

#### Register Webhook
```bash
POST /api/webhooks?url=https://your-server.com/webhook&events=lead.created&events=deal.stage_changed&name=My+Hook
Authorization: Bearer <token>
```

**Available Events:**
- `lead.created` — New lead added
- `lead.updated` — Lead modified
- `deal.created` — New deal created
- `deal.stage_changed` — Deal moved to new stage
- `contact.created` — New contact added
- `task.created` — New task created

**Webhook Payload:**
```json
{
  "event": "lead.created",
  "data": { "lead_id": "lead_xxx", "first_name": "John", ... },
  "timestamp": "2026-03-06T12:00:00Z"
}
```

---

## Integrations

### n8n.io

1. Generate an API key in **Settings → API & Webhooks**
2. In n8n, use **HTTP Request** node:
   - URL: `https://yourdomain.com/api/v1/leads`
   - Authentication: Header Auth → `X-API-Key: earnrm_your_key`
3. For real-time triggers, register a webhook and use n8n's **Webhook Trigger** node

### Notion

Sync CRM data to Notion databases:

```bash
POST /api/v1/notion/sync?entity_type=leads
X-API-Key: earnrm_your_key

# Returns data formatted for Notion's database API
```

### Resend (Email)

Primary email provider for campaigns and transactional emails. Configure in backend `.env`:
```env
RESEND_API_KEY="re_xxx"
SENDER_EMAIL="noreply@earnrm.com"
```

### Twilio (Calling)

Configure in backend `.env`:
```env
TWILIO_ACCOUNT_SID="ACxxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_PHONE_FROM="+44xxx"
```

Set inbound webhook in Twilio Console:
```
https://yourdomain.com/api/webhooks/twilio/inbound
```

### Stripe (Payments)

```env
STRIPE_API_KEY="sk_xxx"
```

---

## Roles & Permissions

| Role | Scope |
|------|-------|
| `super_admin` | Full platform access, Data Explorer, delete users/orgs, discount codes |
| `deputy_admin` | Same as super_admin |
| `support` | View & manage support requests |
| `owner` | Full org access, manage members, billing |
| `admin` | Org management, pipeline visibility |
| `member` | Own leads, deals, tasks |

---

## Database Collections

| Collection | Description |
|-----------|-------------|
| `users` | User accounts with roles |
| `organizations` | Multi-tenant orgs with license limits |
| `leads` | Sales leads with AI scoring & enrichment |
| `contacts` | Converted leads with sales profiles |
| `deals` | Pipeline deals with stage tracking |
| `tasks` | Team tasks with assignments |
| `companies` | Target companies |
| `campaigns` | Email campaigns |
| `calls` | Call logs (inbound & outbound) |
| `scheduled_calls` | Scheduled call reminders |
| `chat_channels` | Team chat channels |
| `messages` | Chat messages |
| `api_keys` | External API keys |
| `webhooks` | Registered webhook endpoints |
| `affiliates` | Affiliate program members |
| `discount_codes` | Promotional discount codes |
| `invoices` | Payment invoices |

---

## License

Proprietary — earnrm by Finerty Ltd. All rights reserved.

Canbury Works, Units 6 and 7, Canbury Business Park, Elm Crescent, Kingston upon Thames, Surrey, KT2 6HJ, UK
