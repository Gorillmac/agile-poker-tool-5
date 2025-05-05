import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend
} from "recharts";
import { FileText, Download, ArrowLeft, CheckCircle2, Clock, ChevronRight, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data for the results page
const SESSION_RESULT = {
  id: 1,
  name: "Sprint 42 Planning",
  team: "Frontend Development Team",
  date: new Date().toISOString(),
  duration: "1 hour 24 minutes",
  participants: 5,
  storiesEstimated: 12,
  consensusRate: 83, // percentage
};

// Sample story data
const STORY_RESULTS = [
  {
    id: 1,
    title: "Offline-Resilient Authentication",
    description: "As a user, I want to be able to register and login even during internet connectivity issues so I can access the system regardless of connection interruptions.",
    finalEstimate: "8",
    consensusRate: 100,
    votingRounds: 1,
    discussion: false,
  },
  {
    id: 2,
    title: "Dashboard for Sprint Metrics",
    description: "As a project manager, I want to see team velocity and sprint progress on my dashboard so I can track project health effectively.",
    finalEstimate: "13",
    consensusRate: 80,
    votingRounds: 2,
    discussion: true,
  },
  {
    id: 3,
    title: "Integration with Multiple Payment Methods",
    description: "As a user, I want to pay using various payment platforms so I can choose my preferred payment method without hassles.",
    finalEstimate: "21",
    consensusRate: 60,
    votingRounds: 3,
    discussion: true,
  },
];

// Voting distribution data for visualization
const VOTE_DISTRIBUTION = [
  { name: '1', count: 1 },
  { name: '2', count: 3 },
  { name: '3', count: 6 },
  { name: '5', count: 15 },
  { name: '8', count: 18 },
  { name: '13', count: 9 },
  { name: '21', count: 5 },
  { name: '?', count: 2 },
];

// Consensus data for visualization
const CONSENSUS_DATA = [
  { name: 'Full Consensus', value: 7 },
  { name: 'Partial Consensus', value: 4 },
  { name: 'Multiple Rounds', value: 1 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function SessionResultsPage() {
  const { sessionId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  
  // Handle export of the session report
  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Your session report has been downloaded as a PDF.",
    });
  };
  
  // Handle sharing the results
  const handleShareResults = () => {
    // In a real app, would generate a shareable link
    toast({
      title: "Share Link Generated",
      description: "A shareable link has been copied to your clipboard.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">{SESSION_RESULT.name} - Results</h1>
                <p className="text-gray-600 mt-1">Session completed on {new Date(SESSION_RESULT.date).toLocaleDateString()}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={handleShareResults}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
                
                <Button className="bg-gradient-to-r from-primary-500 to-primary-600" onClick={handleExportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
            
            <Separator className="my-6" />
          </div>
          
          {/* Session Summary */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Stories</h3>
                  <p className="text-3xl font-bold text-primary-700">{SESSION_RESULT.storiesEstimated}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Points</h3>
                  <p className="text-3xl font-bold text-primary-700">
                    {STORY_RESULTS.reduce((sum, story) => sum + (parseInt(story.finalEstimate) || 0), 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Average Consensus</h3>
                  <p className="text-3xl font-bold text-primary-700">{SESSION_RESULT.consensusRate}%</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Session Duration</h3>
                  <p className="text-3xl font-bold text-primary-700">{SESSION_RESULT.duration}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Section */}
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Vote Distribution</CardTitle>
                <CardDescription>Distribution of all votes across all user stories</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={VOTE_DISTRIBUTION}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8">
                        {VOTE_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <CardTitle>Consensus Analysis</CardTitle>
                <CardDescription>How often the team reached full or partial consensus</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CONSENSUS_DATA}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {CONSENSUS_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Story Results */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Estimated User Stories</h2>
            
            <div className="space-y-4">
              {STORY_RESULTS.map(story => (
                <Card key={story.id} className={`glass overflow-hidden transition ${selectedStory === story.id ? 'ring-2 ring-primary-500' : ''}`}>
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-grow p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{story.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{story.description}</p>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="flex items-center justify-center h-12 w-12 bg-primary-50 rounded-full border-2 border-primary-300">
                            <span className="text-xl font-bold text-primary-700">{story.finalEstimate}</span>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">Story Points</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {story.votingRounds} {story.votingRounds === 1 ? 'round' : 'rounds'}
                        </Badge>
                        
                        <Badge 
                          variant={story.consensusRate >= 75 ? "default" : "outline"}
                          className={story.consensusRate >= 75 ? 
                            "bg-green-100 text-green-800 hover:bg-green-100" : 
                            "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {story.consensusRate}% Consensus
                        </Badge>
                        
                        {story.discussion && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Discussion Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      className={`w-full md:w-auto md:self-stretch flex items-center justify-center p-4 
                      ${story.consensusRate >= 90 
                        ? 'bg-green-50 text-green-700' 
                        : story.consensusRate >= 75 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="flex items-center">
                          {story.consensusRate >= 75 ? (
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                          ) : (
                            <Clock className="h-5 w-5 mr-2" />
                          )}
                          <span className="font-medium">
                            {story.consensusRate >= 90 
                              ? 'Perfect Consensus' 
                              : story.consensusRate >= 75 
                                ? 'Good Consensus' 
                                : 'Limited Consensus'}
                          </span>
                        </div>
                        
                        <Button 
                          variant="link" 
                          className="mt-2 p-0 h-auto text-sm"
                          onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
                        >
                          {selectedStory === story.id ? 'Hide Details' : 'View Details'}
                          <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${selectedStory === story.id ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {selectedStory === story.id && (
                    <div className="p-6 bg-gray-50 border-t">
                      <h4 className="font-medium mb-3">Voting Details</h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={VOTE_DISTRIBUTION.map(item => ({ name: item.name, count: Math.floor(item.count * Math.random()) + 1 }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {story.discussion && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Discussion Notes</h4>
                          <div className="p-3 bg-white rounded border text-sm">
                            <p>The team discussed the complexity of integrating multiple APIs and security considerations. There was initial disagreement about the effort required for testing across different payment providers.</p>
                            <p className="mt-2">After clarifying requirements, the team agreed that additional time would be needed for comprehensive integration testing.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setLocation(`/sessions/${sessionId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Session
            </Button>
            
            <div className="space-x-3">
              <Button onClick={() => setLocation("/history")}>
                View All Sessions
              </Button>
              
              <Button className="bg-gradient-to-r from-primary-500 to-primary-600" onClick={() => setLocation("/dashboard")}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}