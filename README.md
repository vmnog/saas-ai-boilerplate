# ACME - SaaS AI Chat Boilerplate

A production-ready SaaS AI chat boilerplate built with Next.js, Fastify, and OpenAI. Perfect for building AI-powered chat applications with subscription management, user authentication, and more.

<!-- TODO: Add screenshot of the landing page -->
<!-- ![Landing Page](./screenshots/landing.png) -->

## Features

- **AI-Powered Chat** - Built-in OpenAI integration with streaming responses
- **Authentication** - Magic link authentication system
- **Subscription Management** - Stripe integration for payments and subscriptions
- **Multi-tenant** - Support for multiple users with usage limits
- **Modern Stack** - Next.js 14, Fastify, PostgreSQL, Drizzle ORM
- **Responsive Design** - Mobile-first UI with dark mode support
- **File Uploads** - Support for document analysis and attachments
- **Export** - Export conversations to CSV, Excel, or PDF

<!-- TODO: Add screenshot of the chat interface -->
<!-- ![Chat Interface](./screenshots/chat.png) -->

## Tech Stack

### Frontend (UI)

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod

### Backend (API)

- **Framework**: Fastify
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI API, LangChain
- **Payments**: Stripe
- **Email**: React Email + SMTP

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- OpenAI API Key + Assistant ID
- Upstash Vector database (for RAG)
- Stripe Account (for payments)
- SMTP Server (for emails)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/acme-saas-boilerplate.git
cd acme-saas-boilerplate
```

2. Install dependencies:

```bash
# Install API dependencies
cd api
npm install

# Install UI dependencies
cd ../ui
npm install
```

3. Set up environment variables:

**API (.env)**:

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://docker:docker@localhost:5432/acme
WEB_URL=http://localhost:3000

# Email
MAIL_DEFAULT_FROM_NAME="ACME Team"
MAIL_DEFAULT_FROM_EMAIL=contact@example.com
EMAIL_LOGO_URL=https://your-bucket.s3.region.amazonaws.com/logo.png
EMAIL_LOGO_SQUARE_URL=https://your-bucket.s3.region.amazonaws.com/logo-square.png
MAIL_SMTP_HOST=smtp.example.com
MAIL_SMTP_PORT=587
MAIL_SMTP_USER=your-smtp-user
MAIL_SMTP_PASS=your-smtp-password

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ASSISTANT_ID=asst_...

# Auth
USER_JWT_SECRET=your-jwt-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY_LIVE=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Upstash Vector (RAG)
UPSTASH_VECTOR_REST_URL=https://your-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-token
```

**UI (.env.local)**:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com
```

4. Start the database:

```bash
cd api
docker-compose up -d
```

5. Run migrations:

```bash
cd api
npm run db:migrate
```

This seeds the database with three default plans (Free, Basic, Premium). New users are automatically assigned the Free plan.

6. Create an OpenAI Assistant:

Go to [platform.openai.com/assistants](https://platform.openai.com/assistants), create an Assistant, and copy its ID into `OPENAI_ASSISTANT_ID` in your `.env` file.

7. Start the development servers:

```bash
# Terminal 1 - API
cd api
npm run dev

# Terminal 2 - UI
cd ui
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

<!-- TODO: Add screenshot of the dashboard -->
<!-- ![Dashboard](./screenshots/dashboard.png) -->

## Testing

<!-- TODO: Add screenshot of tests -->

![Tests](./screenshots/tests.png)

1. Make sure the Docker test database is running:

```bash
cd api
docker-compose up -d
```

2. Run the test migrations:

```bash
npm run db:migrate:test
```

3. Run the tests:

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

```
.
├── api/                    # Backend API (Fastify)
│   ├── src/
│   │   ├── app/           # Application logic
│   │   ├── db/            # Database schema and migrations
│   │   ├── http/          # HTTP routes and server
│   │   ├── langchain/     # AI/LangChain integration
│   │   └── mail/          # Email templates and sending
│   └── ...
│
├── ui/                     # Frontend (Next.js)
│   ├── app/               # App router pages
│   │   ├── (private)/     # Authenticated routes
│   │   ├── (public)/      # Public routes
│   │   └── ...
│   ├── components/        # Reusable components
│   └── ...
│
└── README.md
```

## Customization

### Branding

1. Replace logo files in `ui/assets/`
2. Update colors in `ui/tailwind.config.ts`
3. Update metadata in `ui/app/layout.tsx`

### Legal Pages

Update the placeholder content in:

- `ui/app/(public)/politicas/termos-de-servico/page.tsx`
- `ui/app/(public)/politicas/politica-de-privacidade/page.tsx`
- `ui/app/(private)/components/terms-dialog.tsx`

Replace:

- `[YOUR ADDRESS]` with your company address
- `XX.XXX.XXX/XXXX-XX` with your tax ID
- `ACME Inc.` with your company name

### AI Prompts

Customize the AI behavior in:

- `api/src/langchain/openai/create-langchain-openai-message.ts`

<!-- TODO: Add screenshot of the settings page -->
<!-- ![Settings](./screenshots/settings.png) -->

## Deployment

### API

The API can be deployed to any Node.js hosting platform:

- Railway
- Render
- AWS EC2/ECS
- DigitalOcean

### UI

The Next.js frontend can be deployed to:

- Vercel (recommended)
- Netlify
- AWS Amplify

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email contact@example.com or open an issue on GitHub.

---

Built with love using Next.js, Fastify, and OpenAI.
