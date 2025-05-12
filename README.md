Agile Poker Planning Tool
Features
User Authentication - Secure login and registration system
Team Management - Create and manage agile teams
Planning Sessions - Host real-time planning poker sessions with team members
Story Estimation - Vote on user stories using standard poker scales
Conflict Resolution - Automated tools to help resolve estimation conflicts
Sprint Assignment - Drag-and-drop interface for assigning stories to sprints
Analytics Dashboard - Comprehensive metrics and performance tracking
Report Generation - Export session results and analytics reports
Session History - Browse and review past planning sessions
Responsive Design - Optimized for desktop and mobile devices
Technology Stack
Frontend: React.js with TypeScript
UI Framework: Tailwind CSS with customized UI components
State Management: React Context for application state
Routing: Wouter for lightweight routing
Forms: React Hook Form with Zod validation
Drag and Drop: React Beautiful DnD
Charts: Recharts for analytics visualizations
Styling: Modern glassmorphism effects and custom animations
Prerequisites
Node.js 18+ and npm
Running 1. cd agile-poker-planning 2. npm install 3. npm run build 4. npm start

4.navigate to http://localhost:5000

Application Flow
The application follows a specific activity flow designed for optimal agile planning:

Login/Registration → User authentication
Dashboard → Overview of teams and sessions
Session Selection → Choose active sessions or create new ones
Session Configuration → Set up session parameters and stories
Waiting Room → Participants join before session begins
Planning Session → Real-time voting on stories
Results → View and discuss estimation results
Conflict Resolution (if needed) → Resolve estimation disagreements
Sprint Assignment → Assign stories to sprints based on estimates
Analytics → Review team performance metrics
Export → Generate reports for stakeholders