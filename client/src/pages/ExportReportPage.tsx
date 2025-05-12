import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Download, 
  Table as FileSpreadsheet, 
  FileText, 
  BarChart3, 
  ArrowLeft, 
  Share2, 
  Upload as FileOutput, 
  CheckCircle,
  Printer,
  Mail,
  Calendar,
  Users,
  ClipboardList,
  FileCode as FileJson,
  File as FilePdf
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample data for export and report visualization
const SESSION_DATA = {
  id: 123,
  name: "Sprint 37 Planning",
  date: new Date(2025, 4, 1),
  facilitator: "John Smith",
  team: "Frontend Development",
  participants: 8,
  completedStories: 12,
  totalStoryPoints: 57,
  averageStoryPoints: 4.75,
  startTime: new Date(2025, 4, 1, 10, 0),
  endTime: new Date(2025, 4, 1, 11, 45),
};

// Story data for the completed stories
const STORY_DATA = [
  { id: 1, title: "Implement login with SSO options", points: 5, voters: 8, consensus: "High" },
  { id: 2, title: "Create responsive dashboard widgets", points: 8, voters: 8, consensus: "Medium" },
  { id: 3, title: "Add dark mode support", points: 3, voters: 7, consensus: "High" },
  { id: 4, title: "Fix navigation issues on mobile", points: 3, voters: 8, consensus: "High" },
  { id: 5, title: "Implement feature flags for A/B testing", points: 8, voters: 6, consensus: "Medium" },
  { id: 6, title: "Improve form validation UX", points: 2, voters: 8, consensus: "High" },
  { id: 7, title: "Add loading state indicators", points: 2, voters: 8, consensus: "High" },
  { id: 8, title: "Integrate with analytics API", points: 5, voters: 7, consensus: "Medium" },
  { id: 9, title: "Create sharable deep links", points: 5, voters: 8, consensus: "High" },
  { id: 10, title: "Optimize images and assets", points: 3, voters: 7, consensus: "High" },
  { id: 11, title: "Implement automated emails", points: 8, voters: 8, consensus: "Low" },
  { id: 12, title: "Add accessibility improvements", points: 5, voters: 8, consensus: "Medium" },
];

// Point distribution data
const POINT_DISTRIBUTION = [
  { points: "1", count: 0 },
  { points: "2", count: 2 },
  { points: "3", count: 3 },
  { points: "5", count: 4 },
  { points: "8", count: 3 },
  { points: "13", count: 0 },
  { points: "21", count: 0 },
];

// Consensus level distribution
const CONSENSUS_DISTRIBUTION = [
  { name: "High", value: 7 },
  { name: "Medium", value: 4 },
  { name: "Low", value: 1 },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Export formats available
const EXPORT_FORMATS = [
  { value: "pdf", label: "PDF Document", icon: FilePdf, description: "Portable Document Format for print-ready reports" },
  { value: "excel", label: "Excel Spreadsheet", icon: FileSpreadsheet, description: "Microsoft Excel format for detailed data analysis" },
  { value: "csv", label: "CSV File", icon: FileText, description: "Comma-separated values for universal compatibility" },
  { value: "json", label: "JSON Data", icon: FileJson, description: "Raw data format for developers" },
];

export default function ExportReportPage() {
  const { user } = useAuth();
  const { sessionId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedExportFormat, setSelectedExportFormat] = useState("pdf");
  const [exportOptions, setExportOptions] = useState({
    includeSummary: true,
    includeStories: true,
    includeCharts: true,
    includeParticipants: true,
    includeTimeStats: true,
  });
  
  // Toggle an export option
  const toggleExportOption = (option: keyof typeof exportOptions) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };
  
  // Handle export/download action
  const handleExport = () => {
    toast({
      title: `Exporting as ${selectedExportFormat.toUpperCase()}`,
      description: "Your report is being generated and will download shortly.",
    });
    
    // In a real app, this would trigger an actual download
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Your ${selectedExportFormat.toUpperCase()} report has been downloaded.`,
      });
    }, 1500);
  };
  
  // Handle email share
  const handleEmailShare = () => {
    toast({
      title: "Email feature",
      description: "The email sharing feature would be implemented here.",
    });
  };
  
  // Format duration in hours and minutes
  const formatDuration = (startTime: Date, endTime: Date) => {
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">Session Report</h1>
                <p className="text-gray-600 mt-1">Export and generate reports from your planning session</p>
              </div>
              
              <Badge 
                variant="outline" 
                className="border-green-500 text-green-700 px-3 py-1"
              >
                <FileOutput className="h-4 w-4 mr-1" />
                Export & Reports
              </Badge>
            </div>
            
            <Separator className="my-4" />
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Export Options */}
            <div className="lg:col-span-1">
              <Card className="glass sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2 text-primary-600" />
                    Export Options
                  </CardTitle>
                  <CardDescription>
                    Select format and customize your export
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Export Format</h3>
                    <Select
                      value={selectedExportFormat}
                      onValueChange={setSelectedExportFormat}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPORT_FORMATS.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            <div className="flex items-center">
                              <format.icon className="h-4 w-4 mr-2 text-primary-600" />
                              <span>{format.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-2">
                      {EXPORT_FORMATS.find(f => f.value === selectedExportFormat)?.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Include Content</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeSummary" 
                          checked={exportOptions.includeSummary}
                          onCheckedChange={() => toggleExportOption('includeSummary')}
                        />
                        <Label htmlFor="includeSummary">Session Summary</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeStories" 
                          checked={exportOptions.includeStories}
                          onCheckedChange={() => toggleExportOption('includeStories')}
                        />
                        <Label htmlFor="includeStories">User Stories & Points</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeCharts" 
                          checked={exportOptions.includeCharts}
                          onCheckedChange={() => toggleExportOption('includeCharts')}
                        />
                        <Label htmlFor="includeCharts">Charts & Visualizations</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeParticipants" 
                          checked={exportOptions.includeParticipants}
                          onCheckedChange={() => toggleExportOption('includeParticipants')}
                        />
                        <Label htmlFor="includeParticipants">Participant Information</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="includeTimeStats" 
                          checked={exportOptions.includeTimeStats}
                          onCheckedChange={() => toggleExportOption('includeTimeStats')}
                        />
                        <Label htmlFor="includeTimeStats">Time Statistics</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full mb-3 bg-gradient-to-r from-primary-500 to-primary-600"
                      onClick={handleExport}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleEmailShare}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Report
                    </Button>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-5 pb-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setLocation(`/sessions/${sessionId}/results`)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Results
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Column: Report Preview */}
            <div className="lg:col-span-2">
              <Card className="glass mb-6">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center mb-3">
                    <CardTitle>{SESSION_DATA.name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                      {SESSION_DATA.date.toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-primary-500" />
                      {SESSION_DATA.team}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ClipboardList className="h-4 w-4 mr-2 text-primary-500" />
                      {SESSION_DATA.completedStories} Stories • {SESSION_DATA.totalStoryPoints} Points
                    </div>
                  </div>
                  
                  <Tabs 
                    defaultValue="summary" 
                    onValueChange={setActiveTab}
                    className="mt-4"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="summary">
                        Summary
                      </TabsTrigger>
                      <TabsTrigger value="stories">
                        User Stories
                      </TabsTrigger>
                      <TabsTrigger value="charts">
                        Charts
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                
                <CardContent className="p-6">
                  <TabsContent value="summary" className="mt-0 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-lg">Session Details</CardTitle>
                        </CardHeader>
                        <CardContent className="py-3 px-4">
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Facilitator:</dt>
                              <dd className="font-medium">{SESSION_DATA.facilitator}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Participants:</dt>
                              <dd className="font-medium">{SESSION_DATA.participants}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Start Time:</dt>
                              <dd className="font-medium">{SESSION_DATA.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">End Time:</dt>
                              <dd className="font-medium">{SESSION_DATA.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Duration:</dt>
                              <dd className="font-medium">{formatDuration(SESSION_DATA.startTime, SESSION_DATA.endTime)}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-lg">Story Points</CardTitle>
                        </CardHeader>
                        <CardContent className="py-3 px-4">
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Total Stories:</dt>
                              <dd className="font-medium">{SESSION_DATA.completedStories}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Total Points:</dt>
                              <dd className="font-medium">{SESSION_DATA.totalStoryPoints}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Average Points/Story:</dt>
                              <dd className="font-medium">{SESSION_DATA.averageStoryPoints}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Most Common Point Value:</dt>
                              <dd className="font-medium">5</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">High Consensus Stories:</dt>
                              <dd className="font-medium">
                                {CONSENSUS_DISTRIBUTION.find(item => item.name === "High")?.value} ({Math.round(CONSENSUS_DISTRIBUTION.find(item => item.name === "High")!.value / SESSION_DATA.completedStories * 100)}%)
                              </dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-lg">Key Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <ul className="space-y-2 list-disc list-inside text-gray-700">
                          <li>The team estimated a total of {SESSION_DATA.totalStoryPoints} story points, demonstrating a strong capacity for the upcoming sprint.</li>
                          <li>High consensus was achieved on {CONSENSUS_DISTRIBUTION.find(item => item.name === "High")?.value} out of {SESSION_DATA.completedStories} stories, indicating good team alignment.</li>
                          <li>With an average of {SESSION_DATA.averageStoryPoints} points per story, the team is focusing on manageable, medium-sized tasks.</li>
                          <li>The session was completed in {formatDuration(SESSION_DATA.startTime, SESSION_DATA.endTime)}, an efficient time frame for estimating {SESSION_DATA.completedStories} stories.</li>
                          <li>The most common story point value was 5, indicating a preference for moderately complex tasks.</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="stories" className="mt-0 space-y-6">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12 text-center">#</TableHead>
                            <TableHead>User Story</TableHead>
                            <TableHead className="w-20 text-center">Points</TableHead>
                            <TableHead className="w-20 text-center">Voters</TableHead>
                            <TableHead className="w-32 text-center">Consensus</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {STORY_DATA.map((story) => (
                            <TableRow key={story.id}>
                              <TableCell className="text-center font-medium">{story.id}</TableCell>
                              <TableCell>{story.title}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {story.points}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">{story.voters}</TableCell>
                              <TableCell className="text-center">
                                <Badge 
                                  variant="outline" 
                                  className={`
                                    ${story.consensus === "High" ? "bg-green-50 text-green-700 border-green-200" : ""}
                                    ${story.consensus === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                                    ${story.consensus === "Low" ? "bg-red-50 text-red-700 border-red-200" : ""}
                                  `}
                                >
                                  {story.consensus}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="text-sm text-gray-500">
                        Showing all {STORY_DATA.length} stories • Total of {SESSION_DATA.totalStoryPoints} points
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="charts" className="mt-0 space-y-8">
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-lg">Story Point Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={POINT_DISTRIBUTION}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="points" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="count" name="Number of Stories" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-lg">Consensus Level</CardTitle>
                        </CardHeader>
                        <CardContent className="py-3 px-4">
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={CONSENSUS_DISTRIBUTION}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                >
                                  {CONSENSUS_DISTRIBUTION.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-lg">Point Value Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="py-3 px-4 space-y-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Points per Story</h4>
                            <div className="flex items-center space-x-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '55%' }}></div>
                              </div>
                              <span className="text-sm font-medium">{SESSION_DATA.averageStoryPoints}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Team Consensus</h4>
                            <div className="flex items-center space-x-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                              <span className="text-sm font-medium">75%</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Estimation Efficiency</h4>
                            <div className="flex items-center space-x-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                              </div>
                              <span className="text-sm font-medium">88%</span>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-gray-500">
                              Team achieved high efficiency in estimating stories with strong consensus on most items.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setLocation(`/sessions/${sessionId}/results`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
            
            <Button variant="outline" onClick={() => {
              toast({
                title: "Share feature",
                description: "The sharing functionality would be implemented here.",
              });
            }}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}