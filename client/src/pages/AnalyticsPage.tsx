import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  TooltipProps
} from "recharts";
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  Users, 
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Download
} from "lucide-react";

// Types
type SprintData = {
  sprintName: string;
  plannedPoints: number;
  completedPoints: number;
  accuracy: number;
}

type VelocityData = {
  sprint: string;
  actual: number;
  average: number;
  projected: number;
}

type AccuracyData = {
  name: string;
  value: number;
}

type TeamPerformance = {
  team: string;
  velocity: number;
  accuracyPercent: number;
  completedStories: number;
  color: string;
}

// Mock data
const sprintHistory: SprintData[] = [
  { sprintName: "Sprint 1", plannedPoints: 30, completedPoints: 23, accuracy: 76.7 },
  { sprintName: "Sprint 2", plannedPoints: 28, completedPoints: 25, accuracy: 89.3 },
  { sprintName: "Sprint 3", plannedPoints: 34, completedPoints: 29, accuracy: 85.3 },
  { sprintName: "Sprint 4", plannedPoints: 32, completedPoints: 30, accuracy: 93.8 },
  { sprintName: "Sprint 5", plannedPoints: 38, completedPoints: 32, accuracy: 84.2 },
  { sprintName: "Sprint 6", plannedPoints: 36, completedPoints: 34, accuracy: 94.4 },
];

const velocityTrend: VelocityData[] = [
  { sprint: "Sprint 1", actual: 23, average: 23, projected: 25 },
  { sprint: "Sprint 2", actual: 25, average: 24, projected: 26 },
  { sprint: "Sprint 3", actual: 29, average: 25.7, projected: 28 },
  { sprint: "Sprint 4", actual: 30, average: 26.8, projected: 30 },
  { sprint: "Sprint 5", actual: 32, average: 27.8, projected: 31 },
  { sprint: "Sprint 6", actual: 34, average: 28.8, projected: 33 },
];

const estimationAccuracy: AccuracyData[] = [
  { name: "Accurate (±10%)", value: 65 },
  { name: "Under-estimated", value: 20 },
  { name: "Over-estimated", value: 15 },
];

const teamPerformance: TeamPerformance[] = [
  { team: "Core Development", velocity: 34, accuracyPercent: 94, completedStories: 12, color: "#4f46e5" },
  { team: "UX/UI Design", velocity: 28, accuracyPercent: 86, completedStories: 8, color: "#8b5cf6" },
  { team: "QA Team", velocity: 26, accuracyPercent: 92, completedStories: 9, color: "#ec4899" },
  { team: "DevOps", velocity: 22, accuracyPercent: 88, completedStories: 7, color: "#14b8a6" },
];

// Colors for pie chart
const COLORS = ['#4f46e5', '#ef4444', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 border rounded-md shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value} {entry.name === "accuracy" ? "%" : "points"}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>("last-6-sprints");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-primary-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your team's agile metrics and performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-3-sprints">Last 3 Sprints</SelectItem>
                <SelectItem value="last-6-sprints">Last 6 Sprints</SelectItem>
                <SelectItem value="last-12-sprints">Last 12 Sprints</SelectItem>
                <SelectItem value="year-to-date">Year to Date</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              className="bg-gradient-to-r from-primary-500 to-primary-600"
              onClick={() => window.location.href = "/export-analytics"}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Analytics
            </Button>
          </div>
        </div>
        
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Velocity (Last Sprint)</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">34</span>
                    <span className="text-sm text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +6%
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Estimation Accuracy</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">92%</span>
                    <span className="text-sm text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +3%
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Teams</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">4</span>
                    <span className="text-sm text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +1
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Planning Sessions</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">26</span>
                    <span className="text-sm text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +8
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2 text-primary-600" />
                    Velocity Trend
                  </CardTitle>
                  <CardDescription>Team velocity over time</CardDescription>
                </div>
                <Badge variant="outline" className="font-normal">
                  Last 6 Sprints
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={velocityTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="sprint" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#4f46e5" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#8b5cf6" 
                      strokeDasharray="5 5" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projected" 
                      stroke="#d1d5db" 
                      strokeDasharray="3 3" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
                    Sprint Comparison
                  </CardTitle>
                  <CardDescription>Planned vs. completed story points</CardDescription>
                </div>
                <Badge variant="outline" className="font-normal">
                  Last 6 Sprints
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sprintHistory}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="sprintName" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="plannedPoints" name="Planned" fill="#8b5cf6" />
                    <Bar dataKey="completedPoints" name="Completed" fill="#4f46e5" />
                    <Bar dataKey="accuracy" name="accuracy" fill="#10b981" hide />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-primary-600" />
                Estimation Accuracy
              </CardTitle>
              <CardDescription>Distribution of estimation outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estimationAccuracy}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {estimationAccuracy.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600" />
                Team Performance
              </CardTitle>
              <CardDescription>Comparing key metrics across teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={teamPerformance}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="team" type="category" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="velocity" name="Velocity" fill="#4f46e5" />
                    <Bar dataKey="completedStories" name="Stories" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tips and insights */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <HelpCircle className="h-5 w-5 mr-2 text-amber-600" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-md border">
                <h3 className="font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  Velocity Improving
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Your team's velocity has increased by 6% compared to the previous sprint, indicating improved efficiency and better estimation.
                </p>
              </div>
              
              <div className="p-3 bg-white rounded-md border">
                <h3 className="font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                  Consistent Planning Accuracy
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Your team has maintained over 90% estimation accuracy for the past 3 sprints, suggesting your planning poker sessions are effective.
                </p>
              </div>
              
              <div className="p-3 bg-white rounded-md border">
                <h3 className="font-medium flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-2 text-purple-600" />
                  Recommendation
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Consider focusing on reducing over-estimation in your next planning poker sessions, as your analytics show a 15% rate of over-estimation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;