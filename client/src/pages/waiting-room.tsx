import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, ArrowRight, CheckCircle2, UserPlus, PlayCircle } from "lucide-react";
import { getInitials } from "@/lib/utils";

// Mock data for waiting room
const SESSION_DATA = {
  id: 1,
  name: "Sprint 42 Planning",
  team: "Frontend Development Team",
  createdBy: "John Smith",
  status: "waiting",
  readiness: 75, // 75% ready
};

// Mock participants
const PARTICIPANTS = [
  { id: 1, name: "John Smith", avatar: undefined, isActive: true, isReady: true, isModerator: true },
  { id: 2, name: "Emily Johnson", avatar: undefined, isActive: true, isReady: true, isModerator: false },
  { id: 3, name: "Michael Davis", avatar: undefined, isActive: true, isReady: true, isModerator: false },
  { id: 4, name: "Sarah Wilson", avatar: undefined, isActive: true, isReady: false, isModerator: false },
];

export default function WaitingRoomPage() {
  const { user } = useAuth();
  const { sessionId } = useParams();
  const [, setLocation] = useLocation();
  
  const [participants, setParticipants] = useState(PARTICIPANTS);
  const [isReady, setIsReady] = useState(false);
  const [secondsToStart, setSecondsToStart] = useState<number | null>(null);
  
  // Check if current user is the moderator
  const isModerator = participants.find(p => p.isModerator)?.name === (user?.name || user?.username);
  
  // Toggle ready status
  const toggleReady = () => {
    setIsReady(!isReady);
    
    // Update user's ready state in participants list
    setParticipants(prevParticipants => 
      prevParticipants.map(p => 
        p.name === (user?.name || user?.username)
          ? { ...p, isReady: !isReady }
          : p
      )
    );
  };
  
  // Start the session (moderator only)
  const startSession = () => {
    // In a real app, would notify the server to start the session
    setSecondsToStart(5); // 5-second countdown before starting
  };
  
  // Simulate a participant joining
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParticipant = {
        id: 5,
        name: "Robert Taylor",
        avatar: undefined,
        isActive: true,
        isReady: false,
        isModerator: false
      };
      
      setParticipants(prev => [...prev, newParticipant]);
    }, 15000); // Join after 15 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle countdown to session start
  useEffect(() => {
    if (secondsToStart === null) return;
    
    if (secondsToStart <= 0) {
      // Navigate to active session
      setLocation(`/sessions/${sessionId}`);
      return;
    }
    
    const timer = setTimeout(() => {
      setSecondsToStart(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [secondsToStart, sessionId, setLocation]);
  
  // Calculate readiness percentage
  const readinessPercentage = Math.round(
    (participants.filter(p => p.isReady).length / participants.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">{SESSION_DATA.name}</h1>
                <p className="text-gray-600 mt-1">Waiting for the session to start</p>
              </div>
              
              <Badge 
                variant="outline" 
                className="border-amber-500 text-amber-700 px-3 py-1"
              >
                <Clock className="h-4 w-4 mr-1" />
                Waiting Room
              </Badge>
            </div>
            
            <Separator className="my-4" />
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Session Info */}
            <div className="lg:col-span-1">
              <Card className="glass h-full">
                <CardHeader>
                  <CardTitle>Session Information</CardTitle>
                  <CardDescription>Details about this planning session</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Team</p>
                    <p className="font-medium">{SESSION_DATA.team}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Moderator</p>
                    <p className="font-medium">
                      {participants.find(p => p.isModerator)?.name || "Not assigned"}
                    </p>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Team Readiness</span>
                      <span className="text-sm font-medium">{readinessPercentage}%</span>
                    </div>
                    <Progress value={readinessPercentage} className="h-2" />
                  </div>
                  
                  {secondsToStart !== null && (
                    <div className="p-4 bg-amber-50 rounded-md border border-amber-200 text-center">
                      <p className="text-amber-800 font-medium">Session Starting In</p>
                      <p className="text-2xl font-bold text-amber-600">{secondsToStart}s</p>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    {isModerator ? (
                      <Button 
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600"
                        onClick={startSession}
                        disabled={secondsToStart !== null}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Start Session
                      </Button>
                    ) : (
                      <Button 
                        variant={isReady ? "outline" : "default"}
                        className={`w-full ${isReady ? "border-green-500 text-green-700" : "bg-gradient-to-r from-primary-500 to-primary-600"}`}
                        onClick={toggleReady}
                      >
                        {isReady ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            I'm Ready
                          </>
                        ) : (
                          "Mark as Ready"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Participants */}
            <div className="lg:col-span-2">
              <Card className="glass h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Participants</CardTitle>
                    <CardDescription>
                      {participants.length} team members in this session
                    </CardDescription>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Invite Members
                  </Button>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {participants.map(participant => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {getInitials(participant.name)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{participant.name}</p>
                              {participant.isModerator && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Moderator
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {participant.isReady ? "Ready" : "Not Ready"}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          {participant.isReady ? (
                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                              <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}