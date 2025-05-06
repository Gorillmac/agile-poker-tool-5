# Agile Poker Planning Tool


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
- **UI Framework**: Tailwind CSS with customized UI components
- **State Management**: React Context for application state
- **Routing**: Wouter for lightweight routing
- **Forms**: React Hook Form with Zod validation
- **Drag and Drop**: React Beautiful DnD
- **Charts**: Recharts for analytics visualizations
- **Styling**: Modern glassmorphism effects and custom animations



### Prerequisites

- Node.js 18+ and npm

Running
1.
  cd agile-poker-planning
2. 
   npm install
3. 
   npm run build
4. 
   npm start  
 

4.navigate to `http://localhost:5000`

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
