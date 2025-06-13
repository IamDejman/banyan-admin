# Banyan Admin Dashboard

A modern, responsive admin dashboard for insurance claims management built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core Features
- 📱 **Fully Mobile Responsive** - Optimized for all screen sizes
- 🔐 **Role-Based Access Control** - Granular permissions system
- 📊 **Advanced Analytics** - Real-time insights and reporting
- 🔄 **Workflow Management** - Customizable approval workflows
- 📨 **Notification System** - Multi-channel notifications (Email, SMS, Push)
- 📝 **Document Management** - Secure document handling
- 🔍 **Audit Trail** - Comprehensive activity logging
- 👥 **Team Management** - Agent and user management
- ⚡ **Performance Monitoring** - Real-time system metrics

### Mobile Responsiveness
- Responsive sidebar with mobile menu
- Mobile-first design approach
- Touch-friendly interfaces
- Adaptive layouts for all screen sizes
- Optimized navigation for mobile devices
- Responsive data tables and forms
- Mobile-friendly modals and dropdowns

### Security Features
- Role-based access control
- Session management
- Audit logging
- Secure document handling
- Two-factor authentication support
- Activity monitoring

### Analytics & Reporting
- Real-time performance metrics
- Custom report builder
- Data visualization
- Export capabilities
- Trend analysis
- Performance benchmarking

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + Zustand
- **Authentication**: NextAuth.js
- **Database**: (To be implemented)
- **API**: (To be implemented)

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/banyan-admin.git
cd banyan-admin
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── auth/             # Authentication pages
│   └── api/              # API routes
├── components/            # React components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   └── shared/           # Shared components
├── lib/                   # Utility functions and types
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── providers/        # Context providers
└── styles/               # Global styles
```

## Development

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Follow mobile-first approach

### Mobile Development Guidelines
- Use responsive design patterns
- Test on multiple devices
- Optimize for touch interactions
- Ensure proper spacing for mobile
- Implement proper loading states

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript](https://www.typescriptlang.org/)
