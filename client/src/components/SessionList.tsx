import { useState } from 'react';
import { useSessions, useCreateSession, useDeleteSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { PlusCircle, Trash2, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlanningSession } from '@/types/api';

export function SessionList() {
  const [, setLocation] = useLocation();
  const { data: sessions, isLoading, error } = useSessions();
  const createSessionMutation = useCreateSession();
  const deleteSessionMutation = useDeleteSession();
  const { toast } = useToast();
  
  const [newSession, setNewSession] = useState({
    name: '',
    team: '',
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleCreateSession = async () => {
    if (!newSession.name.trim() || !newSession.team.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both a session name and team",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createSessionMutation.mutateAsync({
        name: newSession.name,
        team: newSession.team,
        status: 'waiting',
        participants: 0,
        createdBy: 'Current User', // This would come from auth context in real app
      });
      
      // Reset form and close dialog
      setNewSession({ name: '', team: '' });
      setIsDialogOpen(false);
    } catch (err) {
      // Error is handled by the mutation
    }
  };
  
  const handleDeleteSession = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deleteSessionMutation.mutateAsync(id);
    } catch (err) {
      // Error is handled by the mutation
    }
  };
  
  const goToSession = (id: number) => {
    setLocation(`/sessions/${id}`);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Planning Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-md">
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md text-destructive">
        <h2 className="text-lg font-semibold">Error Loading Sessions</h2>
        <p>{error.message || 'Failed to load planning sessions'}</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'waiting':
        return 'bg-yellow-500';
      case 'scheduled':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Planning Sessions</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Planning Session</DialogTitle>
              <DialogDescription>
                Start a new planning poker session for your team.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="session-name">Session Name</Label>
                <Input 
                  id="session-name" 
                  placeholder="Sprint 23 Planning"
                  value={newSession.name}
                  onChange={(e) => setNewSession({...newSession, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team-name">Team</Label>
                <Input 
                  id="team-name" 
                  placeholder="Frontend Team"
                  value={newSession.team}
                  onChange={(e) => setNewSession({...newSession, team: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateSession}
                disabled={createSessionMutation.isPending}
              >
                {createSessionMutation.isPending ? 'Creating...' : 'Create Session'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {sessions && sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <Card 
              key={session.id} 
              className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => goToSession(session.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{session.name}</CardTitle>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>Team: {session.team}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="text-sm">
                  <p>Created by: {session.createdBy}</p>
                  <p>Participants: {session.participants}</p>
                  {session.lastActive && (
                    <p>Last active: {new Date(session.lastActive).toLocaleDateString()}</p>
                  )}
                  {session.scheduledFor && (
                    <p>Scheduled for: {new Date(session.scheduledFor).toLocaleString()}</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => handleDeleteSession(session.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <Button size="sm">
                  Join Session
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-muted/50">
          <h3 className="text-lg font-medium">No Sessions Found</h3>
          <p className="text-muted-foreground mb-4">Create your first planning session to get started</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Session
          </Button>
        </div>
      )}
    </div>
  );
}