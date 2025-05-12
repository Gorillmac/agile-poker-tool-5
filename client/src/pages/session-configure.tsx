import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Users, Clock, Settings, FileText, Import, Upload as UploadIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock user story data for import
const SAMPLE_STORIES = [
  {
    id: 1,
    title: "Offline-Resilient Authentication",
    description: "As a user, I want to be able to register and login even during internet connectivity issues so I can access the system regardless of connection interruptions.",
    priority: "high",
    externalId: "FEAT-123"
  },
  {
    id: 2,
    title: "Dashboard for Sprint Metrics",
    description: "As a project manager, I want to see team velocity and sprint progress on my dashboard so I can track project health effectively.",
    priority: "medium",
    externalId: "FEAT-124"
  },
  {
    id: 3,
    title: "Integration with Multiple Payment Methods",
    description: "As a user, I want to pay using various payment platforms so I can choose my preferred payment method without hassles.",
    priority: "high",
    externalId: "FEAT-125"
  },
];

export default function SessionConfigurePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("setup");
  
  // State for session configuration
  const [sessionName, setSessionName] = useState("Sprint 42 Planning");
  const [votingSystem, setVotingSystem] = useState("fibonacci");
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timerDuration, setTimerDuration] = useState("60");
  const [autoReveal, setAutoReveal] = useState(true);
  
  // State for stories
  const [importedStories, setImportedStories] = useState<typeof SAMPLE_STORIES>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [manualStoryTitle, setManualStoryTitle] = useState("");
  const [manualStoryDescription, setManualStoryDescription] = useState("");
  const [manualStories, setManualStories] = useState<Array<{ title: string; description: string }>>([]);
  
  // Import stories from external source
  const handleImportStories = () => {
    // In a real app, this would connect to JIRA, Trello, etc.
    setImportedStories(SAMPLE_STORIES);
    toast({
      title: "Stories imported",
      description: `Successfully imported ${SAMPLE_STORIES.length} user stories.`,
    });
  };
  
  // Add a manual story
  const handleAddManualStory = () => {
    if (manualStoryTitle.trim() === "") return;
    
    setManualStories([
      ...manualStories,
      {
        title: manualStoryTitle,
        description: manualStoryDescription,
      }
    ]);
    
    setManualStoryTitle("");
    setManualStoryDescription("");
    
    toast({
      title: "Story added",
      description: "User story has been added to the session."
    });
  };
  
  // Start the session
  const handleStartSession = () => {
    const totalStories = importedStories.length + manualStories.length;
    
    if (totalStories === 0) {
      toast({
        title: "No stories added",
        description: "Please add at least one user story before starting the session.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, would save the session configuration and stories to the server
    toast({
      title: "Session ready",
      description: "Your planning poker session is ready to start."
    });
    
    // Navigate to the waiting room / active session
    setLocation("/sessions/1/waiting"); // In a real app, would use the actual session ID
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-900">Configure Your Planning Session</h1>
            <p className="text-gray-600 mt-2">Set up your session and add user stories to estimate - take your time to set everything up properly.</p>
          </div>
          
          {/* Configuration Tabs */}
          <Card className="glass mb-8">
            <CardHeader className="pb-3">
              <Tabs defaultValue="setup" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="setup">
                    <Settings className="h-4 w-4 mr-2" />
                    Session Setup
                  </TabsTrigger>
                  <TabsTrigger value="import">
                    <Import className="h-4 w-4 mr-2" />
                    Import Stories
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <FileText className="h-4 w-4 mr-2" />
                    Add Stories Manually
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="setup" className="mt-0 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="session-name">Session Name</Label>
                  <Input 
                    id="session-name" 
                    value={sessionName} 
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="e.g., Sprint Planning 42" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voting-system">Voting System</Label>
                  <Select value={votingSystem} onValueChange={setVotingSystem}>
                    <SelectTrigger id="voting-system">
                      <SelectValue placeholder="Select voting system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fibonacci">Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34, ?)</SelectItem>
                      <SelectItem value="tshirt">T-Shirt Sizes (XS, S, M, L, XL, XXL, ?)</SelectItem>
                      <SelectItem value="powers">Powers of 2 (0, 1, 2, 4, 8, 16, 32, 64, ?)</SelectItem>
                      <SelectItem value="custom">Custom Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Timing Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="timer-switch">Enable Voting Timer</Label>
                      <p className="text-sm text-gray-500">Set a time limit for each voting round</p>
                    </div>
                    <Switch 
                      id="timer-switch" 
                      checked={timerEnabled}
                      onCheckedChange={setTimerEnabled}
                    />
                  </div>
                  
                  {timerEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="timer-duration">Timer Duration (seconds)</Label>
                      <Input 
                        id="timer-duration" 
                        type="number" 
                        min="10" 
                        max="300"
                        value={timerDuration}
                        onChange={(e) => setTimerDuration(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-reveal">Auto Reveal Votes</Label>
                      <p className="text-sm text-gray-500">Automatically reveal all votes when timer expires</p>
                    </div>
                    <Switch 
                      id="auto-reveal" 
                      checked={autoReveal}
                      onCheckedChange={setAutoReveal}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="import" className="mt-0">
                <div className="space-y-6">
                  <div className="rounded-lg border border-dashed p-10 text-center">
                    <UploadIcon className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Import User Stories</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Connect to your project management tool or upload a CSV file to import user stories.
                    </p>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
                      <Button onClick={handleImportStories}>
                        <Import className="h-4 w-4 mr-2" /> Connect to JIRA
                      </Button>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" /> Upload CSV
                      </Button>
                    </div>
                  </div>
                  
                  {importedStories.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Imported Stories ({importedStories.length})</h3>
                      <div className="space-y-3">
                        {importedStories.map(story => (
                          <Card key={story.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <h4 className="font-medium">{story.title}</h4>
                                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                      {story.externalId}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">{story.description}</p>
                                </div>
                                <div>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    story.priority === 'high' 
                                      ? 'bg-red-50 text-red-700' 
                                      : story.priority === 'medium'
                                        ? 'bg-yellow-50 text-yellow-700'
                                        : 'bg-green-50 text-green-700'
                                  }`}>
                                    {story.priority.charAt(0).toUpperCase() + story.priority.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="mt-0">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="story-title">Story Title</Label>
                      <Input 
                        id="story-title" 
                        placeholder="Enter a concise title for the user story"
                        value={manualStoryTitle}
                        onChange={(e) => setManualStoryTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="story-description">Description</Label>
                      <Textarea 
                        id="story-description" 
                        placeholder="Describe the user story using the format: As a [role], I want [feature] so that [benefit]."
                        className="min-h-[100px]"
                        value={manualStoryDescription}
                        onChange={(e) => setManualStoryDescription(e.target.value)}
                      />
                    </div>
                    
                    <Button onClick={handleAddManualStory}>
                      Add User Story
                    </Button>
                  </div>
                  
                  {manualStories.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Added Stories ({manualStories.length})</h3>
                      <div className="space-y-3">
                        {manualStories.map((story, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <h4 className="font-medium">{story.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">{story.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setLocation("/sessions")}>
              Go Back
            </Button>
            
            <div className="space-x-3">
              <Button 
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Session saved",
                    description: "Your session configuration has been saved as a draft.",
                  });
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save for Later
              </Button>
              
              <Button onClick={handleStartSession}>
                Start Session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}