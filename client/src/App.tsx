import React, { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/use-auth";

// Pages
import Home from "@/pages/Home";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import SessionSelection from "@/pages/session-selection";
import SessionConfigure from "@/pages/session-configure";
import WaitingRoom from "@/pages/waiting-room";
import PlanningSession from "@/pages/PlanningSession";
import SessionResultsPage from "@/pages/SessionResultsPage";
import SessionHistoryPage from "@/pages/SessionHistoryPage";
import ConflictResolutionPage from "@/pages/ConflictResolutionPage";
import TeamFormationPage from "@/pages/TeamFormationPage";
import TeamsPage from "@/pages/TeamsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={AuthPage} />
          
          {/* Protected Routes - Following Activity Diagram Flow */}
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/analytics" component={AnalyticsPage} />
          <ProtectedRoute path="/teams" component={TeamsPage} />
          <ProtectedRoute path="/teams/create" component={TeamFormationPage} />
          
          {/* Session Flow - According to Activity Diagram */}
          <ProtectedRoute path="/sessions" component={SessionSelection} />
          <ProtectedRoute path="/sessions/configure" component={SessionConfigure} />
          <ProtectedRoute path="/sessions/:sessionId/waiting" component={WaitingRoom} />
          <ProtectedRoute path="/sessions/:sessionId/results" component={SessionResultsPage} />
          <ProtectedRoute path="/sessions/:sessionId/conflict" component={ConflictResolutionPage} />
          <ProtectedRoute path="/sessions/:sessionId" component={PlanningSession} />
          <ProtectedRoute path="/history" component={SessionHistoryPage} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Add script to check system preference or saved theme preference
  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply dark mode if saved preference is dark or if system prefers dark and no saved preference
    if (savedTheme === 'dark' || (!savedTheme && systemDarkMode)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
