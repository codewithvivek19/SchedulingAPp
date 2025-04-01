# MNN Schedulo

![MNN Schedulo Logo](public/logo.png)

## Modern Meeting & Appointment Scheduling Platform

MNN Schedulo is a powerful scheduling platform built to streamline the process of booking meetings and managing your availability. Inspired by Calendly but enhanced with modern features for professionals, teams, and businesses.

## Features

- **Smart Scheduling** - Create custom event types with flexible duration options
- **Availability Management** - Define when you're available to meet
- **Seamless Booking Experience** - Simple interface for clients to book appointments
- **Email Notifications** - Automated confirmations and reminders
- **Calendar Integration** - Connect with popular calendar services
- **User Profiles** - Personalized scheduling pages for individuals and teams
- **Mobile Responsive** - Works on all devices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Hosting**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or use Neon for serverless Postgres)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mnn-schedulo.git
cd mnn-schedulo
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=your_postgresql_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fmnn-schedulo)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with ❤️ by MNN Development Team
- Inspired by Calendly and modern scheduling solutions
