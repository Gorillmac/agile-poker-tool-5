import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { 
  MessageSquare, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Bookmark, 
  RefreshCw,
  MessageCircle,
  PieChart as PieChartIcon,
  ChevronRight,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

// Sample data for the conflict resolution page
const STORY_DATA = {
  id: 3,
  title: "Integration with Multiple Payment Methods",
  description: "As a user, I want to pay using various payment platforms so I can choose my preferred payment method without hassles.",
  estimate: null,
  status: "conflict",
};

// Sample participants data
const PARTICIPANTS = [
  { id: 1, name: "John Smith", avatar: undefined, vote: "8", comment: "This involves multiple API integrations and thorough testing." },
  { id: 2, name: "Emily Johnson", avatar: undefined, vote: "13", comment: "The security requirements add significant complexity." },
  { id: 3, name: "Michael Davis", avatar: undefined, vote: "13", comment: "I agree with Emily. Security compliance is a major concern." },
  { id: 4, name: "Sarah Wilson", avatar: undefined, vote: "21", comment: "We also need to consider regional payment methods and localization." },
  { id: 5, name: "Robert Taylor", avatar: undefined, vote: "8", comment: "We can reuse components from our existing payment system." },
];

// Vote distribution data
const VOTE_DISTRIBUTION = [
  { value: "8", count: 2 },
  { value: "13", count: 2 },
  { value: "21", count: 1 },
];

// Discussion topics
const TOPICS = [
  { id: 1, title: "API Integration Complexity", description: "How many payment methods are required? What are the integration challenges?", resolved: true },
  { id: 2, title: "Security Requirements", description: "What security standards must be met? PCI compliance?", resolved: false },
  { id: 3, title: "Testing Approach", description: "How do we test across various payment providers? Do we need a sandbox environment?", resolved: false },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ConflictResolutionPage() {
  const { user } = useAuth();
  const { sessionId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("discussion");
  const [discussionNotes, setDiscussionNotes] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<number | null>(null);
  const [isReadyForRevote, setIsReadyForRevote] = useState(false);
  
  // Handle revote action
  const handleRevote = () => {
    toast({
      title: "Revote initiated",
      description: "Team members will be asked to vote again on this story.",
    });
    
    // In a real app, this would redirect to the voting interface
    setLocation(`/sessions/${sessionId}`);
  };
  
  // Handle the action to mark an issue as resolved
  const handleMarkResolved = (topicId: number) => {
    toast({
      title: "Topic marked as resolved",
      description: "The discussion topic has been marked as resolved.",
    });
    
    // In a real app, this would update the topic status
    setIsReadyForRevote(true);
  };
  
  // Function to calculate the ratio of consensus
  const calculateConsensusRatio = () => {
    const voteCounts = VOTE_DISTRIBUTION.map(v => v.count);
    const maxVotes = Math.max(...voteCounts);
    const totalVotes = voteCounts.reduce((a, b) => a + b, 0);
    
    return (maxVotes / totalVotes) * 100;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">Resolve Estimation Conflict</h1>
                <p className="text-gray-600 mt-1">Work with your team to find consensus on this user story</p>
              </div>
              
              <Badge 
                variant="outline" 
                className="border-amber-500 text-amber-700 px-3 py-1"
              >
                <Users className="h-4 w-4 mr-1" />
                Conflict Resolution
              </Badge>
            </div>
            
            <Separator className="my-4" />
          </div>
          
          {/* Story Details */}
          <Card className="glass mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{STORY_DATA.title}</h2>
                  <p className="text-gray-600 mt-1">{STORY_DATA.description}</p>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  <Badge variant="outline" className="border-amber-500 text-amber-700">
                    Unresolved
                  </Badge>
                  
                  <div className="h-12 w-12 bg-white rounded-full border-2 border-amber-300 flex items-center justify-center">
                    <span className="text-xl font-bold text-amber-700">?</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Participants and Votes */}
            <div className="lg:col-span-1">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary-600" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    {PARTICIPANTS.length} members with votes
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-4 py-0">
                  <div className="divide-y">
                    {PARTICIPANTS.map(participant => (
                      <div 
                        key={participant.id} 
                        className={`py-4 px-2 cursor-pointer transition hover:bg-gray-50 rounded-md ${
                          selectedParticipant === participant.id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => setSelectedParticipant(
                          selectedParticipant === participant.id ? null : participant.id
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback className="bg-primary-100 text-primary-700">
                                {getInitials(participant.name)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              <div className="flex items-center mt-1">
                                <div className="h-6 w-6 bg-white rounded-md border flex items-center justify-center">
                                  <span className="text-sm font-bold">{participant.vote}</span>
                                </div>
                                <ChevronRight className={`h-4 w-4 ml-1 text-gray-400 transition-transform ${
                                  selectedParticipant === participant.id ? 'rotate-90' : ''
                                }`} />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {selectedParticipant === participant.id && (
                          <div className="mt-3 pl-12">
                            <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
                              "{participant.comment}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-primary-600" />
                    Vote Distribution
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={VOTE_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="value"
                          label={({ value, name }) => `${name}: ${value}`}
                        >
                          {VOTE_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                    <h3 className="text-sm font-medium text-amber-800">Consensus Analysis</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      {calculateConsensusRatio().toFixed(0)}% consensus on the highest vote. 
                      75% is needed for team agreement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column: Tabs for Discussion and Resolution */}
            <div className="lg:col-span-2">
              <Card className="glass">
                <CardHeader className="pb-0">
                  <Tabs defaultValue="discussion" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="discussion">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Discussion
                      </TabsTrigger>
                      <TabsTrigger value="topics">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Topics to Resolve
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                
                <CardContent className="p-6">
                  <TabsContent value="discussion" className="mt-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Team Discussion</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Discuss the different perspectives to reach a common understanding.
                        Capture key points from the conversation below.
                      </p>
                      
                      <div className="space-y-4">
                        <Textarea 
                          placeholder="Capture discussion notes here..." 
                          className="min-h-[200px]"
                          value={discussionNotes}
                          onChange={(e) => setDiscussionNotes(e.target.value)}
                        />
                        
                        <div className="flex justify-end">
                          <Button onClick={() => {
                            toast({
                              title: "Notes saved",
                              description: "The discussion notes have been saved.",
                            });
                          }}>
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Save Notes
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Voting Analysis</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={VOTE_DISTRIBUTION}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="value" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Number of Votes" fill="#8884d8">
                              {VOTE_DISTRIBUTION.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="topics" className="mt-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Discussion Topics</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Address these discussion points to resolve the estimation conflict.
                        Mark topics as resolved once the team reaches agreement.
                      </p>
                      
                      <div className="space-y-4">
                        {TOPICS.map(topic => (
                          <Card key={topic.id} className={topic.resolved ? 'bg-green-50' : 'bg-white'}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium flex items-center">
                                    {topic.resolved ? (
                                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                    ) : (
                                      <MessageCircle className="h-4 w-4 mr-2 text-amber-600" />
                                    )}
                                    {topic.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                                </div>
                                
                                {!topic.resolved && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleMarkResolved(topic.id)}
                                  >
                                    Mark Resolved
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="pt-2">
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
                        <h3 className="text-md font-medium text-blue-800 flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-blue-600" />
                          Resolution Progress
                        </h3>
                        <p className="text-sm text-blue-700 mt-1">
                          {TOPICS.filter(t => t.resolved).length} out of {TOPICS.length} topics resolved.
                          {isReadyForRevote 
                            ? " Team is ready for a revote!" 
                            : " Continue resolving discussion topics."}
                        </p>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600"
                        onClick={handleRevote}
                        disabled={!isReadyForRevote}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Start Revote
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setLocation(`/sessions/${sessionId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Session
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-blue-500 to-blue-600"
              onClick={() => setLocation(`/sessions/${sessionId}/sprint-assignment`)}
            >
              Continue to Sprint Assignment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}