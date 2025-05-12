import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { Search, Filter, Calendar, Users, BarChart2, ArrowRight, Download, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Sample data for session history
const SESSION_HISTORY = [
  {
    id: 1,
    name: "Sprint 42 Planning",
    team: "Frontend Development Team",
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    participants: 5,
    storiesEstimated: 12,
    totalPoints: 89,
    duration: "1h 24m",
    consensusRate: 83,
  },
  {
    id: 2,
    name: "Sprint 41 Planning",
    team: "Frontend Development Team",
    date: new Date(Date.now() - 86400000 * 16).toISOString(), // 16 days ago
    participants: 6,
    storiesEstimated: 14,
    totalPoints: 94,
    duration: "1h 52m",
    consensusRate: 79,
  },
  {
    id: 3,
    name: "API Integration Planning",
    team: "Backend Development Team",
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    participants: 4,
    storiesEstimated: 8,
    totalPoints: 61,
    duration: "58m",
    consensusRate: 91,
  },
  {
    id: 4,
    name: "UX Improvement Planning",
    team: "Design Team",
    date: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 days ago
    participants: 7,
    storiesEstimated: 9,
    totalPoints: 42,
    duration: "1h 10m",
    consensusRate: 86,
  },
  {
    id: 5,
    name: "Sprint 40 Planning",
    team: "Frontend Development Team",
    date: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
    participants: 5,
    storiesEstimated: 13,
    totalPoints: 84,
    duration: "1h 40m",
    consensusRate: 81,
  },
];

// Trend data for visualization
const TREND_DATA = [
  { sprint: 'Sprint 38', points: 76, consensus: 75, participants: 4 },
  { sprint: 'Sprint 39', points: 81, consensus: 78, participants: 5 },
  { sprint: 'Sprint 40', points: 84, consensus: 81, participants: 5 },
  { sprint: 'Sprint 41', points: 94, consensus: 79, participants: 6 },
  { sprint: 'Sprint 42', points: 89, consensus: 83, participants: 5 },
];

export default function SessionHistoryPage() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all-sessions");
  
  // Filter sessions based on search term and team filter
  const filteredSessions = SESSION_HISTORY.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = teamFilter === "all" || session.team === teamFilter;
    
    return matchesSearch && matchesTeam;
  });
  
  // Get unique team names for the filter dropdown
  const teams = Array.from(new Set(SESSION_HISTORY.map(session => session.team)));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">Session History</h1>
                <p className="text-gray-600 mt-1">View and analyze your past planning poker sessions</p>
              </div>
              
              <Button className="mt-4 md:mt-0 bg-gradient-to-r from-primary-500 to-primary-600" onClick={() => setLocation("/sessions")}>
                Start New Session
              </Button>
            </div>
            
            <Separator className="my-6" />
          </div>
          
          {/* Filter Controls */}
          <Card className="glass mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    className="pl-10" 
                    placeholder="Search by session name or team..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-64">
                  <Select value={teamFilter} onValueChange={setTeamFilter}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-500" />
                        <SelectValue placeholder="Filter by team" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teams</SelectItem>
                      {teams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs and Content */}
          <Tabs defaultValue="all-sessions" onValueChange={setActiveTab}>
            <div className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all-sessions">All Sessions</TabsTrigger>
                <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
                <TabsTrigger value="teams">Team Performance</TabsTrigger>
              </TabsList>
            </div>
            
            {/* All Sessions Tab */}
            <TabsContent value="all-sessions" className="mt-0">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Planning Sessions</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session Name</TableHead>
                          <TableHead>Team</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Stories</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Consensus</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSessions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                              No sessions found. Try adjusting your search criteria.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSessions.map(session => (
                            <TableRow key={session.id}>
                              <TableCell className="font-medium">{session.name}</TableCell>
                              <TableCell>{session.team}</TableCell>
                              <TableCell>{formatDate(session.date)}</TableCell>
                              <TableCell>{session.storiesEstimated}</TableCell>
                              <TableCell>{session.totalPoints}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={session.consensusRate >= 85 ? "default" : "outline"}
                                  className={session.consensusRate >= 85 
                                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                    : session.consensusRate >= 75
                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                      : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  }
                                >
                                  {session.consensusRate}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1 text-gray-500" />
                                  {session.duration}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex items-center text-primary-600"
                                  onClick={() => setLocation(`/sessions/${session.id}/results`)}
                                >
                                  View Details
                                  <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Trends Tab */}
            <TabsContent value="trends" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2 text-primary-600" />
                      Story Point Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={TREND_DATA}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="sprint" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="points" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                            name="Total Points"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary-600" />
                      Team Consensus Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={TREND_DATA}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="sprint" />
                          <YAxis domain={[50, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="consensus" 
                            stroke="#82ca9d" 
                            name="Team Consensus %"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="participants" 
                            stroke="#ffc658" 
                            name="Participants"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                      Planning Performance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-md border border-green-100">
                        <h3 className="font-medium text-green-800 mb-1">Average Consensus</h3>
                        <p className="text-2xl font-bold text-green-700">
                          {(SESSION_HISTORY.reduce((sum, s) => sum + s.consensusRate, 0) / SESSION_HISTORY.length).toFixed(1)}%
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                          Above 75% is considered good consensus
                        </p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                        <h3 className="font-medium text-blue-800 mb-1">Average Session Duration</h3>
                        <p className="text-2xl font-bold text-blue-700">1h 25m</p>
                        <p className="text-sm text-blue-600 mt-2">
                          Down 12% from previous sprints
                        </p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
                        <h3 className="font-medium text-purple-800 mb-1">Total Story Points</h3>
                        <p className="text-2xl font-bold text-purple-700">
                          {SESSION_HISTORY.reduce((sum, s) => sum + s.totalPoints, 0)}
                        </p>
                        <p className="text-sm text-purple-600 mt-2">
                          Across {SESSION_HISTORY.reduce((sum, s) => sum + s.storiesEstimated, 0)} stories
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Analytics Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Teams Tab */}
            <TabsContent value="teams" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {teams.map(team => {
                      const teamSessions = SESSION_HISTORY.filter(s => s.team === team);
                      const avgConsensus = teamSessions.reduce((sum, s) => sum + s.consensusRate, 0) / teamSessions.length;
                      const totalPoints = teamSessions.reduce((sum, s) => sum + s.totalPoints, 0);
                      
                      return (
                        <div key={team} className="p-4 rounded-md border bg-white">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-medium">{team}</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {teamSessions.length} planning sessions
                              </p>
                            </div>
                            
                            <div className="mt-4 md:mt-0 grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <p className="text-sm text-gray-500">Avg. Consensus</p>
                                <p className="text-lg font-semibold text-primary-700">{avgConsensus.toFixed(1)}%</p>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-sm text-gray-500">Total Points</p>
                                <p className="text-lg font-semibold text-primary-700">{totalPoints}</p>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-sm text-gray-500">Stories</p>
                                <p className="text-lg font-semibold text-primary-700">
                                  {teamSessions.reduce((sum, s) => sum + s.storiesEstimated, 0)}
                                </p>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4 md:mt-0"
                              onClick={() => {
                                setTeamFilter(team);
                                setActiveTab("all-sessions");
                              }}
                            >
                              View Sessions
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}