import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '../services';
import { PlanningSession, UserStory } from '../types/api';
import { useToast } from '@/hooks/use-toast';

// Hook for fetching all planning sessions
export function useSessions() {
  return useQuery({
    queryKey: ['/api/sessions'],
    queryFn: () => sessionService.getAllSessions(),
  });
}

// Hook for fetching a specific planning session
export function useSession(id: number) {
  return useQuery({
    queryKey: ['/api/sessions', id],
    queryFn: () => sessionService.getSessionById(id),
    enabled: !!id,
  });
}

// Hook for creating a new planning session
export function useCreateSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (newSession: Partial<PlanningSession>) => 
      sessionService.createSession(newSession),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      toast({
        title: "Success!",
        description: "Session created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create session: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Hook for updating a planning session
export function useUpdateSession(id: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (sessionData: Partial<PlanningSession>) => 
      sessionService.updateSession(id, sessionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      toast({
        title: "Success!",
        description: "Session updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update session: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Hook for deleting a planning session
export function useDeleteSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: number) => sessionService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      toast({
        title: "Success!",
        description: "Session deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete session: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Hook for submitting a vote
export function useSubmitVote(sessionId: number, storyId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (vote: string) => 
      sessionService.submitVote(sessionId, storyId, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId] });
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to submit vote: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

// Hook for revealing votes
export function useRevealVotes(sessionId: number, storyId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: () => sessionService.revealVotes(sessionId, storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId] });
      toast({
        title: "Votes Revealed",
        description: "All votes have been revealed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to reveal votes: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}