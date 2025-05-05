import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Plus,
  UserPlus,
  Settings,
  Trash2,
  Edit,
  BarChart3, 
  Calendar,
  MessageSquare,
  Mail
} from "lucide-react";
import { getInitials } from "@/lib/utils";

type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  avatar?: string;
  isActive: boolean;
}

type Team = {
  id: number;
  name: string;
  description: string;
  members: TeamMember[];
  totalSessions: number;
  averageVelocity: number;
  createdAt: Date;
}

const TeamsPage = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "Core Development Team",
      description: "Backend and frontend developers responsible for core product features",
      members: [
        { id: 1, name: user?.name || user?.username || "You", email: "you@example.com", role: 'Owner', isActive: true },
        { id: 2, name: "Alex Thompson", email: "alex@example.com", role: 'Admin', isActive: true },
        { id: 3, name: "Maria Garcia", email: "maria@example.com", role: 'Member', isActive: true },
        { id: 4, name: "James Wilson", email: "james@example.com", role: 'Member', isActive: false },
      ],
      totalSessions: 24,
      averageVelocity: 32,
      createdAt: new Date(2024, 9, 15)
    },
    {
      id: 2,
      name: "UX/UI Design Team",
      description: "Design and user experience specialists focused on product interface and user journeys",
      members: [
        { id: 1, name: user?.name || user?.username || "You", email: "you@example.com", role: 'Member', isActive: true },
        { id: 5, name: "Sarah Chen", email: "sarah@example.com", role: 'Owner', isActive: true },
        { id: 6, name: "David Patel", email: "david@example.com", role: 'Member', isActive: true },
      ],
      totalSessions: 16,
      averageVelocity: 24,
      createdAt: new Date(2024, 10, 3)
    },
  ]);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleCreateTeam = () => {
    if (newTeamName.trim() === "") return;
    
    const newTeam: Team = {
      id: teams.length + 1,
      name: newTeamName,
      description: newTeamDescription,
      members: [
        { id: 1, name: user?.name || user?.username || "You", email: "you@example.com", role: 'Owner', isActive: true },
      ],
      totalSessions: 0,
      averageVelocity: 0,
      createdAt: new Date()
    };
    
    setTeams([...teams, newTeam]);
    setNewTeamName("");
    setNewTeamDescription("");
    setIsCreateTeamDialogOpen(false);
  };

  const handleInviteMember = () => {
    if (selectedTeam && inviteEmail.trim() !== "") {
      // In a real app, this would send an invitation email
      // For now, just simulate adding a new member with a random name
      const nameParts = inviteEmail.split('@')[0].split('.');
      const capitalizedParts = nameParts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      );
      const generatedName = capitalizedParts.join(' ');
      
      const newMember: TeamMember = {
        id: Math.max(...selectedTeam.members.map(m => m.id)) + 1,
        name: generatedName,
        email: inviteEmail,
        role: 'Member',
        isActive: false // Pending acceptance
      };
      
      const updatedTeams = teams.map(team => 
        team.id === selectedTeam.id
          ? { ...team, members: [...team.members, newMember] }
          : team
      );
      
      setTeams(updatedTeams);
      setSelectedTeam({ ...selectedTeam, members: [...selectedTeam.members, newMember] });
      setInviteEmail("");
      setIsInviteDialogOpen(false);
    }
  };

  const handleRemoveMember = (teamId: number, memberId: number) => {
    // Don't allow removing yourself
    if (memberId === 1) return;
    
    const updatedTeams = teams.map(team => 
      team.id === teamId
        ? { ...team, members: team.members.filter(m => m.id !== memberId) }
        : team
    );
    
    setTeams(updatedTeams);
    
    if (selectedTeam && selectedTeam.id === teamId) {
      setSelectedTeam({
        ...selectedTeam, 
        members: selectedTeam.members.filter(m => m.id !== memberId)
      });
    }
  };

  const handleChangeRole = (teamId: number, memberId: number, newRole: TeamMember['role']) => {
    const updatedTeams = teams.map(team => 
      team.id === teamId
        ? {
            ...team,
            members: team.members.map(member => 
              member.id === memberId
                ? { ...member, role: newRole }
                : member
            )
          }
        : team
    );
    
    setTeams(updatedTeams);
    
    if (selectedTeam && selectedTeam.id === teamId) {
      setSelectedTeam({
        ...selectedTeam,
        members: selectedTeam.members.map(member => 
          member.id === memberId
            ? { ...member, role: newRole }
            : member
        )
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary-900">My Teams</h1>
          
          <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                <Plus className="mr-2 h-4 w-4" /> Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Team</DialogTitle>
                <DialogDescription>
                  Add a new team to collaborate on planning poker sessions.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input 
                    id="team-name" 
                    placeholder="e.g. Frontend Team" 
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Input 
                    id="team-description" 
                    placeholder="Brief description of the team" 
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateTeamDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTeam}>Create Team</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {/* Teams list */}
            <div className="glass rounded-lg overflow-hidden">
              <div className="bg-primary-50/50 px-4 py-3 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary-600" />
                  Your Teams
                </h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {teams.map(team => (
                    <div 
                      key={team.id}
                      className={`p-3 rounded-md border cursor-pointer transition-all ${
                        selectedTeam?.id === team.id
                          ? 'bg-primary-50 border-primary-300'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTeam(team)}
                    >
                      <h3 className="font-medium text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{team.description}</p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          {team.members.length} members
                        </span>
                        
                        <Badge variant="outline">
                          {team.members.find(m => m.id === 1)?.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            {selectedTeam ? (
              <div className="glass rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTeam.name}</h2>
                      <p className="text-gray-600 mt-1">{selectedTeam.description}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          alert("Team settings feature coming soon!");
                        }}
                      >
                        <Settings className="h-4 w-4 mr-1" /> Settings
                      </Button>
                      
                      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <UserPlus className="h-4 w-4 mr-1" /> Invite
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                            <DialogDescription>
                              Send an invitation email to a new team member.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="invite-email">Email Address</Label>
                              <Input 
                                id="invite-email" 
                                placeholder="colleague@example.com" 
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleInviteMember}>
                              <Mail className="h-4 w-4 mr-1" /> Send Invitation
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="members">
                  <div className="px-6 pt-4 border-b">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="members">Members</TabsTrigger>
                      <TabsTrigger value="activity">Team Activity</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="members" className="p-0">
                    <div className="p-6">
                      <div className="mb-4 flex justify-between items-center">
                        <h3 className="text-lg font-medium">Team Members</h3>
                        <Badge variant="outline" className="px-2 py-1">
                          {selectedTeam.members.length} Total
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedTeam.members.map(member => (
                          <div key={member.id} className="flex items-center justify-between p-3 rounded-md bg-white border">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="bg-primary-100 text-primary-700">
                                  {getInitials(member.name)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-gray-500">{member.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <Badge variant={
                                member.role === 'Owner' 
                                  ? 'default' 
                                  : member.role === 'Admin'
                                    ? 'secondary'
                                    : 'outline'
                              } className="mr-4">
                                {member.role}
                              </Badge>
                              
                              {/* Only show controls for other members if you're an Owner */}
                              {member.id !== 1 && selectedTeam.members.find(m => m.id === 1)?.role === 'Owner' && (
                                <div className="flex space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-3.5 w-3.5" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Change Role for {member.name}</DialogTitle>
                                        <DialogDescription>
                                          Update team member permissions by changing their role.
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label>Select Role</Label>
                                          <div className="flex space-x-2">
                                            <Button 
                                              variant={member.role === 'Admin' ? 'default' : 'outline'}
                                              onClick={() => handleChangeRole(selectedTeam.id, member.id, 'Admin')}
                                            >
                                              Admin
                                            </Button>
                                            <Button 
                                              variant={member.role === 'Member' ? 'default' : 'outline'}
                                              onClick={() => handleChangeRole(selectedTeam.id, member.id, 'Member')}
                                            >
                                              Member
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleRemoveMember(selectedTeam.id, member.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity" className="p-0">
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">Team Statistics</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-primary-700">
                                {selectedTeam.totalSessions}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Planning Sessions</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-primary-700">
                                {selectedTeam.averageVelocity}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Avg. Velocity</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-primary-700">
                                {selectedTeam.members.filter(m => m.isActive).length}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Active Members</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">Recent Activity</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-3 rounded-md bg-white border">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Sprint Planning Session</p>
                              <p className="text-sm text-gray-500">Completed estimation for 12 user stories</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-white border">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <UserPlus className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">New Team Member</p>
                              <p className="text-sm text-gray-500">Maria Garcia joined the team</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">5 days ago</p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-white border">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                              <BarChart3 className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">Retrospective Meeting</p>
                              <p className="text-sm text-gray-500">Team discussed process improvements</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="glass rounded-lg p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Team</h3>
                <p className="text-gray-600 mb-6">Choose a team from the list or create a new one to view details</p>
                
                <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create a New Team
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;