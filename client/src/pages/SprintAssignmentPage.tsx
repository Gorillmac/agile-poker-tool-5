import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  CalendarDays, 
  CheckCircle, 
  ChevronDown, 
  ChevronsUpDown, 
  Filter, 
  MoreHorizontal, 
  MoveRight, 
  Plus, 
  Save, 
  Calendar, 
  Clock, 
  Users, 
  Flag, 
  ClipboardList
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Sample session data
const SESSION_DATA = {
  id: 123,
  name: "Sprint 37 Planning",
  team: "Frontend Development",
  facilitator: "John Smith",
  completedStories: 12,
  totalStoryPoints: 57,
};

// Define types for our data
type Story = {
  id: number;
  title: string;
  points: number;
  assignedTo: number | null;
  priority: string;
  tags: string[];
};

type Sprint = {
  id: number;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  capacity: number | null;
  assignedPoints: number;
  remaining: number | null;
  stories: Story[];
};

// Sample sprint data
const SPRINTS: Sprint[] = [
  { 
    id: 1, 
    name: "Sprint 37", 
    startDate: new Date(2025, 4, 5), 
    endDate: new Date(2025, 4, 19), 
    capacity: 40, 
    assignedPoints: 0,
    remaining: 40,
    stories: []
  },
  { 
    id: 2, 
    name: "Sprint 38", 
    startDate: new Date(2025, 4, 19), 
    endDate: new Date(2025, 5, 2), 
    capacity: 45, 
    assignedPoints: 0,
    remaining: 45,
    stories: []
  },
  { 
    id: 3, 
    name: "Backlog", 
    startDate: null, 
    endDate: null, 
    capacity: null, 
    assignedPoints: 0,
    remaining: null,
    stories: []
  },
];

// Sample estimated stories
const INITIAL_STORIES: Story[] = [
  { id: 1, title: "Implement login with SSO options", points: 5, assignedTo: null, priority: "High", tags: ["Auth", "UI"] },
  { id: 2, title: "Create responsive dashboard widgets", points: 8, assignedTo: null, priority: "Medium", tags: ["Dashboard", "UI"] },
  { id: 3, title: "Add dark mode support", points: 3, assignedTo: null, priority: "Low", tags: ["UI", "Theme"] },
  { id: 4, title: "Fix navigation issues on mobile", points: 3, assignedTo: null, priority: "High", tags: ["Mobile", "Bug"] },
  { id: 5, title: "Implement feature flags for A/B testing", points: 8, assignedTo: null, priority: "Medium", tags: ["Testing", "Backend"] },
  { id: 6, title: "Improve form validation UX", points: 2, assignedTo: null, priority: "Medium", tags: ["UX", "Forms"] },
  { id: 7, title: "Add loading state indicators", points: 2, assignedTo: null, priority: "Low", tags: ["UI", "UX"] },
  { id: 8, title: "Integrate with analytics API", points: 5, assignedTo: null, priority: "Medium", tags: ["Integration", "Analytics"] },
  { id: 9, title: "Create sharable deep links", points: 5, assignedTo: null, priority: "Medium", tags: ["Sharing", "Mobile"] },
  { id: 10, title: "Optimize images and assets", points: 3, assignedTo: null, priority: "Low", tags: ["Performance", "Assets"] },
  { id: 11, title: "Implement automated emails", points: 8, assignedTo: null, priority: "High", tags: ["Notifications", "Backend"] },
  { id: 12, title: "Add accessibility improvements", points: 5, assignedTo: null, priority: "High", tags: ["Accessibility", "UI"] },
];

// Priority badge colors
const PRIORITY_COLORS = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  Low: "bg-green-100 text-green-800 border-green-200",
};

export default function SprintAssignmentPage() {
  const { user } = useAuth();
  const { sessionId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State for unassigned and assigned stories
  const [unassignedStories, setUnassignedStories] = useState([...INITIAL_STORIES]);
  const [sprints, setSprints] = useState(SPRINTS);
  
  // Filtering state
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterPoints, setFilterPoints] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get all unique tags from stories
  const allTags: string[] = INITIAL_STORIES.flatMap(story => story.tags)
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .sort();
  
  // Apply filters to unassigned stories
  const filteredUnassignedStories = unassignedStories.filter(story => {
    // Priority filter
    if (filterPriority && story.priority !== filterPriority) return false;
    
    // Points filter
    if (filterPoints && story.points.toString() !== filterPoints) return false;
    
    // Tag filter
    if (filterTag && !story.tags.includes(filterTag)) return false;
    
    // Search query
    if (searchQuery && !story.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });
  
  // Handle drag and drop
  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    // If dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // If moving within the unassigned stories list
    if (source.droppableId === "unassigned" && destination.droppableId === "unassigned") {
      const items = Array.from(unassignedStories);
      const [movedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, movedItem);
      setUnassignedStories(items);
      return;
    }
    
    // If moving from unassigned to a sprint
    if (source.droppableId === "unassigned" && destination.droppableId.startsWith("sprint-")) {
      const sprintId = parseInt(destination.droppableId.replace("sprint-", ""));
      const items = Array.from(unassignedStories);
      const [movedItem] = items.splice(source.index, 1);
      
      // Update sprints with the moved item
      const updatedSprints = sprints.map(sprint => {
        if (sprint.id === sprintId) {
          const updatedStories = [...sprint.stories];
          updatedStories.splice(destination.index, 0, movedItem);
          return {
            ...sprint,
            stories: updatedStories,
            assignedPoints: sprint.assignedPoints + movedItem.points,
            remaining: sprint.capacity !== null ? sprint.capacity - (sprint.assignedPoints + movedItem.points) : null
          };
        }
        return sprint;
      });
      
      setUnassignedStories(items);
      setSprints(updatedSprints);
      
      toast({
        title: "Story assigned",
        description: `"${movedItem.title}" assigned to ${
          sprintId === 3 ? "Backlog" : sprints.find(s => s.id === sprintId)?.name
        }`,
      });
      
      return;
    }
    
    // If moving from a sprint to unassigned
    if (source.droppableId.startsWith("sprint-") && destination.droppableId === "unassigned") {
      const sourceSprintId = parseInt(source.droppableId.replace("sprint-", ""));
      const sourceSprint = sprints.find(sprint => sprint.id === sourceSprintId);
      
      if (sourceSprint) {
        const sprintItems = Array.from(sourceSprint.stories);
        const [movedItem] = sprintItems.splice(source.index, 1);
        
        // Update unassigned stories
        const updatedUnassigned = [...unassignedStories];
        updatedUnassigned.splice(destination.index, 0, movedItem);
        
        // Update sprints
        const updatedSprints = sprints.map(sprint => {
          if (sprint.id === sourceSprintId) {
            return {
              ...sprint,
              stories: sprintItems,
              assignedPoints: sprint.assignedPoints - movedItem.points,
              remaining: sprint.capacity !== null ? sprint.capacity - (sprint.assignedPoints - movedItem.points) : null
            };
          }
          return sprint;
        });
        
        setUnassignedStories(updatedUnassigned);
        setSprints(updatedSprints);
        
        toast({
          title: "Story unassigned",
          description: `"${movedItem.title}" moved back to unassigned stories`,
        });
      }
      
      return;
    }
    
    // If moving from one sprint to another
    if (source.droppableId.startsWith("sprint-") && destination.droppableId.startsWith("sprint-")) {
      const sourceSprintId = parseInt(source.droppableId.replace("sprint-", ""));
      const destSprintId = parseInt(destination.droppableId.replace("sprint-", ""));
      
      const sourceSprint = sprints.find(sprint => sprint.id === sourceSprintId);
      const destSprint = sprints.find(sprint => sprint.id === destSprintId);
      
      if (sourceSprint && destSprint) {
        // Create copies of the story arrays
        const sourceItems = Array.from(sourceSprint.stories);
        const destItems = Array.from(destSprint.stories);
        
        // Remove the story from the source sprint
        const [movedItem] = sourceItems.splice(source.index, 1);
        
        // Add the story to the destination sprint
        destItems.splice(destination.index, 0, movedItem);
        
        // Update sprints
        const updatedSprints = sprints.map(sprint => {
          if (sprint.id === sourceSprintId) {
            return {
              ...sprint,
              stories: sourceItems,
              assignedPoints: sprint.assignedPoints - movedItem.points,
              remaining: sprint.capacity !== null ? sprint.capacity - (sprint.assignedPoints - movedItem.points) : null
            };
          }
          if (sprint.id === destSprintId) {
            return {
              ...sprint,
              stories: destItems,
              assignedPoints: sprint.assignedPoints + movedItem.points,
              remaining: sprint.capacity !== null ? sprint.capacity - (sprint.assignedPoints + movedItem.points) : null
            };
          }
          return sprint;
        });
        
        setSprints(updatedSprints);
        
        toast({
          title: "Story moved",
          description: `"${movedItem.title}" moved to ${
            destSprintId === 3 ? "Backlog" : destSprint.name
          }`,
        });
      }
    }
  };
  
  // Calculate total points
  const totalUnassignedPoints = unassignedStories.reduce((sum, story) => sum + story.points, 0);
  const totalAssignedPoints = sprints.reduce((sum, sprint) => sum + sprint.assignedPoints, 0);
  
  // Handle save assignment
  const handleSaveAssignment = () => {
    // In a real app, would save assignments to database
    toast({
      title: "Assignments saved",
      description: `Successfully assigned ${totalAssignedPoints} points to sprints.`,
    });
    
    // Navigate to the next page in the flow
    setLocation(`/sessions/${sessionId}/export`);
  };
  
  // Format date in readable format
  const formatDate = (date: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">Sprint Assignment</h1>
                <p className="text-gray-600 mt-1">Assign stories to sprints based on priority and team capacity</p>
              </div>
              
              <Badge 
                variant="outline" 
                className="border-blue-500 text-blue-700 px-3 py-1"
              >
                <CalendarDays className="h-4 w-4 mr-1" />
                Sprint Planning
              </Badge>
            </div>
            
            <Separator className="my-4" />
            
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
              <div className="flex items-center text-blue-800">
                <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
                  <div className="flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Session</div>
                      <div className="text-sm text-blue-700">{SESSION_DATA.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Team</div>
                      <div className="text-sm text-blue-700">{SESSION_DATA.team}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Flag className="h-5 w-5 mr-2 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Estimated</div>
                      <div className="text-sm text-blue-700">{SESSION_DATA.completedStories} stories • {SESSION_DATA.totalStoryPoints} points</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Unassigned Stories */}
            <div className="lg:col-span-1">
              <Card className="glass h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>Unassigned Stories</span>
                    <Badge variant="outline" className="ml-2 text-primary-700">
                      {unassignedStories.length} stories • {totalUnassignedPoints} points
                    </Badge>
                  </CardTitle>
                  
                  <div className="space-y-2">
                    <Input
                      placeholder="Search stories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                    
                    <div className="flex flex-wrap gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <Filter className="h-3.5 w-3.5 mr-1" />
                            Priority
                            {filterPriority && <Badge className="ml-1 h-5 px-1.5">{filterPriority}</Badge>}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => setFilterPriority(null)}>
                            All Priorities
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterPriority("High")}>
                            High
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterPriority("Medium")}>
                            Medium
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFilterPriority("Low")}>
                            Low
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <ChevronsUpDown className="h-3.5 w-3.5 mr-1" />
                            Points
                            {filterPoints && <Badge className="ml-1 h-5 px-1.5">{filterPoints}</Badge>}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => setFilterPoints(null)}>
                            All Points
                          </DropdownMenuItem>
                          {[1, 2, 3, 5, 8, 13].map(point => (
                            <DropdownMenuItem key={point} onClick={() => setFilterPoints(point.toString())}>
                              {point} {point === 1 ? 'Point' : 'Points'}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <Filter className="h-3.5 w-3.5 mr-1" />
                            Tag
                            {filterTag && <Badge className="ml-1 h-5 px-1.5">{filterTag}</Badge>}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => setFilterTag(null)}>
                            All Tags
                          </DropdownMenuItem>
                          {allTags.map(tag => (
                            <DropdownMenuItem key={tag} onClick={() => setFilterTag(tag)}>
                              {tag}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="unassigned">
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="p-2 h-[500px] overflow-auto"
                        >
                          {filteredUnassignedStories.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500 italic">
                              {unassignedStories.length === 0 ? 
                                "All stories have been assigned" :
                                "No stories match your filters"}
                            </div>
                          ) : (
                            filteredUnassignedStories.map((story, index) => (
                              <Draggable key={story.id} draggableId={`story-${story.id}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="mb-2 border rounded-md p-3 bg-white hover:shadow-sm cursor-move transition-shadow"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{story.title}</h3>
                                        <div className="flex items-center mt-2 flex-wrap gap-1">
                                          <Badge 
                                            variant="outline" 
                                            className={`${PRIORITY_COLORS[story.priority as keyof typeof PRIORITY_COLORS]} mr-1`}
                                          >
                                            {story.priority}
                                          </Badge>
                                          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                            {story.points} {story.points === 1 ? 'point' : 'points'}
                                          </Badge>
                                          {story.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-800">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column: Sprints */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="sprint-1" className="h-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="sprint-1">{sprints[0].name}</TabsTrigger>
                  <TabsTrigger value="sprint-2">{sprints[1].name}</TabsTrigger>
                  <TabsTrigger value="backlog">Backlog</TabsTrigger>
                </TabsList>
                
                <DragDropContext onDragEnd={onDragEnd}>
                  {sprints.slice(0, 2).map((sprint, index) => (
                    <TabsContent key={sprint.id} value={`sprint-${index + 1}`} className="mt-0 h-full">
                      <Card className="glass h-full">
                        <CardHeader className="pb-3">
                          <CardTitle>{sprint.name}</CardTitle>
                          <CardDescription>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div>
                                <div className="text-xs text-gray-500">Date Range</div>
                                <div className="text-sm font-medium flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-primary-600" />
                                  {formatDate(sprint.startDate!)} - {formatDate(sprint.endDate!)}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Capacity</div>
                                <div className="text-sm font-medium flex items-center">
                                  <Users className="h-3.5 w-3.5 mr-1 text-primary-600" />
                                  {sprint.capacity} points
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Remaining</div>
                                <div className={`text-sm font-medium flex items-center ${
                                  sprint.remaining! < 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {sprint.remaining} points
                                </div>
                              </div>
                            </div>
                          </CardDescription>
                          
                          <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-2 ${
                                sprint.remaining! < 0 ? 'bg-red-500' : 
                                (sprint.assignedPoints / sprint.capacity!) > 0.9 ? 'bg-amber-500' : 'bg-green-500'
                              }`} 
                              style={{ width: `${Math.min(100, (sprint.assignedPoints / sprint.capacity!) * 100)}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-sm">
                              <span className="font-medium">{sprint.assignedPoints}</span> / {sprint.capacity} points assigned
                            </div>
                            <Badge variant="outline" className="text-primary-700">
                              {sprint.stories.length} stories
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                          <Droppable droppableId={`sprint-${sprint.id}`}>
                            {(provided) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="p-2 h-[400px] overflow-auto"
                              >
                                {sprint.stories.length === 0 ? (
                                  <div className="flex items-center justify-center h-full text-gray-500 italic">
                                    No stories assigned to this sprint yet.<br />
                                    Drag stories from the unassigned list.
                                  </div>
                                ) : (
                                  sprint.stories.map((story, index) => (
                                    <Draggable key={story.id} draggableId={`story-${story.id}-assigned`} index={index}>
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="mb-2 border rounded-md p-3 bg-white hover:shadow-sm cursor-move transition-shadow"
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                              <h3 className="font-medium text-gray-900">{story.title}</h3>
                                              <div className="flex items-center mt-2 flex-wrap gap-1">
                                                <Badge 
                                                  variant="outline" 
                                                  className={`${PRIORITY_COLORS[story.priority as keyof typeof PRIORITY_COLORS]} mr-1`}
                                                >
                                                  {story.priority}
                                                </Badge>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                                  {story.points} {story.points === 1 ? 'point' : 'points'}
                                                </Badge>
                                                {story.tags.map(tag => (
                                                  <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-800">
                                                    {tag}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                  
                  <TabsContent value="backlog" className="mt-0 h-full">
                    <Card className="glass h-full">
                      <CardHeader>
                        <CardTitle>Backlog</CardTitle>
                        <CardDescription>
                          Stories for future sprints
                        </CardDescription>
                        
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-primary-700">
                            {sprints[2].stories.length} stories • {sprints[2].assignedPoints} points
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-0">
                        <Droppable droppableId="sprint-3">
                          {(provided) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="p-2 h-[400px] overflow-auto"
                            >
                              {sprints[2].stories.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500 italic">
                                  No stories in the backlog.<br />
                                  Drag stories here that can't fit in current sprints.
                                </div>
                              ) : (
                                sprints[2].stories.map((story, index) => (
                                  <Draggable key={story.id} draggableId={`story-${story.id}-backlog`} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="mb-2 border rounded-md p-3 bg-white hover:shadow-sm cursor-move transition-shadow"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{story.title}</h3>
                                            <div className="flex items-center mt-2 flex-wrap gap-1">
                                              <Badge 
                                                variant="outline" 
                                                className={`${PRIORITY_COLORS[story.priority as keyof typeof PRIORITY_COLORS]} mr-1`}
                                              >
                                                {story.priority}
                                              </Badge>
                                              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                                {story.points} {story.points === 1 ? 'point' : 'points'}
                                              </Badge>
                                              {story.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-800">
                                                  {tag}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </DragDropContext>
              </Tabs>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setLocation(`/sessions/${sessionId}/results`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
            
            <div className="space-x-3">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-primary-500 to-primary-600"
                onClick={handleSaveAssignment}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Assignment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}