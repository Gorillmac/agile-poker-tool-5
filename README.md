# Agile Poker Planning Tool

A sophisticated, modern web application for agile teams to conduct effective planning poker sessions and streamline sprint estimation processes.

![Agile Poker Planning Tool](./attached_assets/Screenshot%202025-04-21%20110034.png)

## Overview

The Agile Poker Planning Tool provides a comprehensive digital solution for agile teams to collaborate on story point estimation. This application supports the entire planning flow from session creation to sprint assignment, with advanced features for conflict resolution, analytics, and reporting.

## Features

- **User Authentication** - Secure login and registration system
- **Team Management** - Create and manage agile teams
- **Planning Sessions** - Host real-time planning poker sessions with team members
- **Story Estimation** - Vote on user stories using standard poker scales
- **Conflict Resolution** - Automated tools to help resolve estimation conflicts
- **Sprint Assignment** - Drag-and-drop interface for assigning stories to sprints
- **Analytics Dashboard** - Comprehensive metrics and performance tracking
- **Report Generation** - Export session results and analytics reports
- **Session History** - Browse and review past planning sessions
- **Responsive Design** - Optimized for desktop and mobile devices

## Technology Stack

- **Frontend**: React.js with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, React Context for local state
- **Routing**: Wouter for lightweight routing
- **Forms**: React Hook Form with Zod validation
- **Drag and Drop**: React Beautiful DnD
- **Charts**: Recharts for analytics visualizations
- **Authentication**: Custom authentication system with session persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (optional, in-memory storage available for development)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd agile-poker-planning-tool
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/agile_poker
   SESSION_SECRET=your_session_secret_here
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Application Flow

The application follows a specific activity flow designed for optimal agile planning:

1. **Login/Registration** → User authentication
2. **Dashboard** → Overview of teams and sessions
3. **Session Selection** → Choose active sessions or create new ones
4. **Session Configuration** → Set up session parameters and stories
5. **Waiting Room** → Participants join before session begins
6. **Planning Session** → Real-time voting on stories
7. **Results** → View and discuss estimation results
8. **Conflict Resolution** (if needed) → Resolve estimation disagreements
9. **Sprint Assignment** → Assign stories to sprints based on estimates
10. **Analytics** → Review team performance metrics
11. **Export** → Generate reports for stakeholders

## Deployment

The application can be deployed on any Node.js-compatible hosting service:

1. Build the production-ready application
   ```
   npm run build
   ```

2. Start the production server
   ```
   npm start
   ```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contributing

For internal development teams:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

Project Manager - [your-email@example.com](mailto:your-email@example.com)