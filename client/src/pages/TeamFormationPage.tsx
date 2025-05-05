import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Settings, 
  ChevronRight, 
  Trash, 
  CheckCircle, 
  ArrowLeft, 
  Save, 
  Shield, 
  User, 
  UserCog 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Sample data for form values
const DEFAULT_TEAM: z.infer<typeof teamFormSchema> = {
  name: "",
  description: "",
  visibility: "private" as const,
  autoJoin: false,
};

// Sample organization users
const ORGANIZATION_USERS = [
  { id: 1, name: "John Smith", email: "john.smith@example.com", role: "Admin", avatar: undefined, department: "Engineering" },
  { id: 2, name: "Emily Johnson", email: "emily.johnson@example.com", role: "Member", avatar: undefined, department: "Product" },
  { id: 3, name: "Michael Davis", email: "michael.davis@example.com", role: "Member", avatar: undefined, department: "Engineering" },
  { id: 4, name: "Sarah Wilson", email: "sarah.wilson@example.com", role: "Member", avatar: undefined, department: "Design" },
  { id: 5, name: "Robert Taylor", email: "robert.taylor@example.com", role: "Member", avatar: undefined, department: "Marketing" },
  { id: 6, name: "Jennifer Brown", email: "jennifer.brown@example.com", role: "Member", avatar: undefined, department: "Engineering" },
  { id: 7, name: "David Miller", email: "david.miller@example.com", role: "Member", avatar: undefined, department: "Finance" },
];

// Team member roles
const MEMBER_ROLES = [
  { value: "owner", label: "Owner", description: "Full access and control over the team" },
  { value: "admin", label: "Admin", description: "Can manage team settings and members" },
  { value: "member", label: "Member", description: "Can participate in planning sessions" },
  { value: "observer", label: "Observer", description: "Can view sessions but not vote" },
];

// Team form schema
const teamFormSchema = z.object({
  name: z.string().min(3, { message: "Team name must be at least 3 characters" }),
  description: z.string().optional(),
  visibility: z.enum(["public", "private"]),
  autoJoin: z.boolean().default(false),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function TeamFormationPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [teamMembers, setTeamMembers] = useState<Array<{ id: number; role: string }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  
  // Form handling
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: DEFAULT_TEAM,
  });
  
  // Handle submission of the team creation form
  function onSubmit(data: TeamFormValues) {
    if (teamMembers.length === 0) {
      toast({
        title: "No team members",
        description: "Please add at least one team member before creating the team.",
        variant: "destructive",
      });
      setActiveTab("members");
      return;
    }
    
    // In a real app, would send data to the server
    toast({
      title: "Team created",
      description: `Team "${data.name}" has been created successfully.`,
    });
    
    // Navigate to teams page
    setLocation("/teams");
  }
  
  // Toggle a user's membership in the team
  const toggleTeamMember = (userId: number, role: string = "member") => {
    setTeamMembers(prevMembers => {
      const isAlreadyMember = prevMembers.some(member => member.id === userId);
      
      if (isAlreadyMember) {
        return prevMembers.filter(member => member.id !== userId);
      } else {
        return [...prevMembers, { id: userId, role }];
      }
    });
  };
  
  // Change a member's role
  const changeMemberRole = (userId: number, role: string) => {
    setTeamMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === userId ? { ...member, role } : member
      )
    );
  };
  
  // Filter users based on search term
  const filteredUsers = ORGANIZATION_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">Create New Team</h1>
                <p className="text-gray-600 mt-1">Form a team for agile planning poker sessions</p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setLocation("/teams")}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Teams
              </Button>
            </div>
            
            <Separator className="my-4" />
          </div>
          
          {/* Team Creation Form */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle>Team Information</CardTitle>
              <CardDescription>
                Provide details about your new planning poker team
              </CardDescription>
              
              <Tabs defaultValue="details" onValueChange={setActiveTab} value={activeTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">
                    <Settings className="h-4 w-4 mr-2" />
                    Team Details
                  </TabsTrigger>
                  <TabsTrigger value="members">
                    <Users className="h-4 w-4 mr-2" />
                    Team Members
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <TabsContent value="details" className="mt-0">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Frontend Development Team" 
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This name will be used to identify your team in the application.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the purpose and focus of this team..." 
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A brief description of the team's purpose and focus areas.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
                        <FormField
                          control={form.control}
                          name="visibility"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Team Visibility</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select visibility" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="public">
                                    <div className="flex items-center">
                                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                                      <span>Public</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="private">
                                    <div className="flex items-center">
                                      <Shield className="h-4 w-4 mr-2 text-amber-600" />
                                      <span>Private</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Public teams are visible to all organization members.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="autoJoin"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <div className="flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel>Auto-join</FormLabel>
                                  <FormDescription>
                                    Allow new organization members to join automatically
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="pt-2 flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setLocation("/teams")}
                        >
                          Cancel
                        </Button>
                        
                        <Button 
                          type="button"
                          onClick={() => setActiveTab("members")}
                          className="bg-gradient-to-r from-primary-500 to-primary-600"
                        >
                          <ChevronRight className="h-4 w-4 mr-1" />
                          Continue to Members
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="members" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">Team Members</h3>
                          <Badge>
                            {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'} selected
                          </Badge>
                        </div>
                        
                        <div className="relative mb-6">
                          <Input
                            type="text"
                            placeholder="Search users by name, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                          <UserPlus className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                        
                        <div className="border rounded-md overflow-hidden">
                          <div className="max-h-96 overflow-y-auto">
                            {filteredUsers.length === 0 ? (
                              <div className="p-6 text-center text-gray-500">
                                No users found matching your search criteria.
                              </div>
                            ) : (
                              <div className="divide-y">
                                {filteredUsers.map(orgUser => {
                                  const isSelected = teamMembers.some(m => m.id === orgUser.id);
                                  const memberRole = teamMembers.find(m => m.id === orgUser.id)?.role || "member";
                                  
                                  return (
                                    <div 
                                      key={orgUser.id} 
                                      className={`p-4 transition ${isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <Avatar className="h-10 w-10 mr-3">
                                            <AvatarImage src={orgUser.avatar} />
                                            <AvatarFallback className="bg-primary-100 text-primary-700">
                                              {getInitials(orgUser.name)}
                                            </AvatarFallback>
                                          </Avatar>
                                          
                                          <div>
                                            <p className="font-medium">{orgUser.name}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                              <span>{orgUser.email}</span>
                                              <span className="mx-2">•</span>
                                              <span>{orgUser.department}</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3">
                                          {isSelected && (
                                            <Select 
                                              value={memberRole}
                                              onValueChange={(value) => changeMemberRole(orgUser.id, value)}
                                            >
                                              <SelectTrigger className="w-36">
                                                <SelectValue placeholder="Select role" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {MEMBER_ROLES.map(role => (
                                                  <SelectItem key={role.value} value={role.value}>
                                                    <div className="flex items-center">
                                                      {role.value === "owner" && <UserCog className="h-4 w-4 mr-2 text-purple-600" />}
                                                      {role.value === "admin" && <Shield className="h-4 w-4 mr-2 text-blue-600" />}
                                                      {role.value === "member" && <User className="h-4 w-4 mr-2 text-green-600" />}
                                                      {role.value === "observer" && <Users className="h-4 w-4 mr-2 text-amber-600" />}
                                                      <span>{role.label}</span>
                                                    </div>
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          )}
                                          
                                          <Button 
                                            type="button"
                                            variant={isSelected ? "destructive" : "outline"}
                                            size="sm"
                                            onClick={() => toggleTeamMember(orgUser.id)}
                                          >
                                            {isSelected ? (
                                              <>
                                                <Trash className="h-4 w-4 mr-1" />
                                                Remove
                                              </>
                                            ) : (
                                              <>
                                                <UserPlus className="h-4 w-4 mr-1" />
                                                Add
                                              </>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Selected Team Members</h3>
                        
                        {teamMembers.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 border rounded-md">
                            No team members selected yet. Add team members from the list above.
                          </div>
                        ) : (
                          <div className="border rounded-md overflow-hidden">
                            <div className="divide-y">
                              {teamMembers.map(member => {
                                const userDetails = ORGANIZATION_USERS.find(u => u.id === member.id);
                                const roleDetails = MEMBER_ROLES.find(r => r.value === member.role);
                                
                                if (!userDetails) return null;
                                
                                return (
                                  <div key={member.id} className="p-4 bg-white">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <Avatar className="h-10 w-10 mr-3">
                                          <AvatarImage src={userDetails.avatar} />
                                          <AvatarFallback className="bg-primary-100 text-primary-700">
                                            {getInitials(userDetails.name)}
                                          </AvatarFallback>
                                        </Avatar>
                                        
                                        <div>
                                          <p className="font-medium">{userDetails.name}</p>
                                          <div className="flex items-center text-sm text-gray-500">
                                            <Badge variant="outline" className="mr-2">
                                              {roleDetails?.label || member.role}
                                            </Badge>
                                            <span>{userDetails.email}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <Button 
                                        type="button"
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => toggleTeamMember(member.id)}
                                      >
                                        <Trash className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-2 flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setActiveTab("details")}
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Back to Details
                        </Button>
                        
                        <div className="space-x-3">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Team saved as draft",
                                description: "Your team configuration has been saved as a draft.",
                              });
                            }}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save Draft
                          </Button>
                          
                          <Button 
                            type="submit"
                            className="bg-gradient-to-r from-primary-500 to-primary-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Create Team
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}