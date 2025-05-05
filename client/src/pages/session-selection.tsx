import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Users, Plus, PlayCircle, Clock } from "lucide-react";

// Define session type
type Session = {
  id: number;
  name: string;
  team: string;
  createdBy: string;
  participants: number;
  status: 'active' | 'waiting' | 'scheduled';
  lastActive?: Date;
  scheduledFor?: Date;
};

// Mock session data - would come from API in real application
const EXISTING_SESSIONS: Session[] = [
  {
    id: 1,
    name: "Lekker Sprint 42 Planning",
    team: "Joburg Frontend Team",
    createdBy: "Lerato Nkosi",
    participants: 5,
    status: "active",
    lastActive: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
  },
  {
    id: 2,
    name: "Backlog Refinement (No Load Shedding!)",
    team: "Cape Town Product",
    createdBy: "Mandla Mbeki",
    participants: 8,
    status: "waiting",
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: 3,
    name: "Tech Debt Prioritization (Post-Braai)",
    team: "Durban Backend Team",
    createdBy: "Themba Naidoo",
    participants: 6,
    status: "scheduled",
    scheduledFor: new Date(Date.now() + 3600 * 1000), // 1 hour from now
  },
];

// Session Types for tabs
type SessionTabType = "active" | "scheduled" | "create";

export default function SessionSelectionPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<SessionTabType>("active");
  
  // Handle joining a session
  const handleJoinSession = (sessionId: number) => {
    setLocation(`/sessions/${sessionId}/waiting`);
  };
  
  // Handle creating a new session
  const handleCreateSession = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, would call API to create session
    setLocation("/sessions/configure");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lekker Planning Poker Sessions</h1>
            <p className="text-gray-600">
              Join an existing session or create a new one to start estimating with your team - no load shedding, no problem!
            </p>
          </div>
          
          {/* Sessions Container */}
          <Card className="glass">
            <CardHeader>
              <h2 className="text-xl font-bold">Choose Your Session, Bru</h2>
            </CardHeader>

            <Tabs defaultValue="active" onValueChange={(value) => setActiveTab(value as SessionTabType)}>
              <CardContent>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="active">Active Sessions</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  <TabsTrigger value="create">Create New</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active">
                  <div className="space-y-4">
                    {EXISTING_SESSIONS.filter(s => s.status === "active" || s.status === "waiting").map(session => (
                      <Card key={session.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-lg font-medium text-gray-900">{session.name}</h3>
                                  <Badge 
                                    variant={session.status === "active" ? "default" : "outline"}
                                    className={`ml-2 ${session.status === "active" ? "bg-green-500" : "border-amber-500 text-amber-700"}`}
                                  >
                                    {session.status === "active" ? "In Progress" : "Waiting to Start"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Team: {session.team}</p>
                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {session.status === "active" && session.lastActive
                                      ? `Started ${Math.round((Date.now() - session.lastActive.getTime()) / 60000)} minutes ago` 
                                      : "Waiting for moderator"}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <div className="flex items-center mr-4">
                                  <Users className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="text-sm text-gray-600">{session.participants}</span>
                                </div>
                                <Button 
                                  onClick={() => handleJoinSession(session.id)}
                                  className="bg-gradient-to-r from-primary-500 to-primary-600"
                                >
                                  Join Now, Bru!
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {EXISTING_SESSIONS.filter(s => s.status === "active" || s.status === "waiting").length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No active sessions found.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setActiveTab("create")}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Create a Session
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="scheduled">
                  <div className="space-y-4">
                    {EXISTING_SESSIONS.filter(s => s.status === "scheduled").map(session => (
                      <Card key={session.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-lg font-medium text-gray-900">{session.name}</h3>
                                  <Badge 
                                    variant="outline"
                                    className="ml-2 border-blue-500 text-blue-700"
                                  >
                                    Scheduled
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Team: {session.team}</p>
                                <div className="flex items-center text-xs text-gray-500 mt-2">
                                  <CalendarDays className="h-3 w-3 mr-1" />
                                  <span>
                                    {session.scheduledFor?.toLocaleString(undefined, {
                                      dateStyle: 'short',
                                      timeStyle: 'short',
                                    })}
                                  </span>
                                </div>
                              </div>
                              
                              <Button 
                                variant="outline"
                                onClick={() => handleJoinSession(session.id)}
                              >
                                Save it for Later, Bru
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {EXISTING_SESSIONS.filter(s => s.status === "scheduled").length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No scheduled sessions found.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setActiveTab("create")}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Schedule a Session
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="create">
                  <form onSubmit={handleCreateSession} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="session-name">Session Name (Make it Lekker!)</Label>
                      <Input id="session-name" placeholder="e.g., Joburg Sprint Planning 42" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="team">Team Name</Label>
                      <Input id="team" placeholder="e.g., Cape Town Frontend Okes" required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" type="time" required />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="submit" className="bg-gradient-to-r from-primary-500 to-primary-600">
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Create Lekker Session, Bru!
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}