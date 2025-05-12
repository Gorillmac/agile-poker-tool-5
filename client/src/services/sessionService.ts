import { apiService } from './api';
import { PlanningSession, UserStory } from '../types/api';

const ENDPOINTS = {
  SESSIONS: '/sessions',
  SESSION: (id: number) => `/sessions/${id}`,
  STORIES: (id: number) => `/sessions/${id}/stories`,
  STORY: (sessionId: number, storyId: number) => `/sessions/${sessionId}/stories/${storyId}`,
  VOTE: (sessionId: number, storyId: number) => `/sessions/${sessionId}/stories/${storyId}/vote`,
  REVEAL: (sessionId: number, storyId: number) => `/sessions/${sessionId}/stories/${storyId}/reveal`,
  RESULTS: (id: number) => `/sessions/${id}/results`,
};

export const sessionService = {
  // Sessions
  getAllSessions: () => 
    apiService.get<PlanningSession[]>(ENDPOINTS.SESSIONS),
    
  getSessionById: (id: number) => 
    apiService.get<PlanningSession>(ENDPOINTS.SESSION(id)),
    
  createSession: (session: Partial<PlanningSession>) => 
    apiService.post<PlanningSession>(ENDPOINTS.SESSIONS, session),
    
  updateSession: (id: number, sessionData: Partial<PlanningSession>) => 
    apiService.put<PlanningSession>(ENDPOINTS.SESSION(id), sessionData),
    
  deleteSession: (id: number) => 
    apiService.delete<void>(ENDPOINTS.SESSION(id)),
    
  // Stories
  getSessionStories: (sessionId: number) => 
    apiService.get<UserStory[]>(ENDPOINTS.STORIES(sessionId)),
    
  getStoryById: (sessionId: number, storyId: number) => 
    apiService.get<UserStory>(ENDPOINTS.STORY(sessionId, storyId)),
    
  createStory: (sessionId: number, story: Partial<UserStory>) => 
    apiService.post<UserStory>(ENDPOINTS.STORIES(sessionId), story),
    
  updateStory: (sessionId: number, storyId: number, storyData: Partial<UserStory>) => 
    apiService.put<UserStory>(ENDPOINTS.STORY(sessionId, storyId), storyData),
    
  deleteStory: (sessionId: number, storyId: number) => 
    apiService.delete<void>(ENDPOINTS.STORY(sessionId, storyId)),
    
  // Voting
  submitVote: (sessionId: number, storyId: number, vote: string) => 
    apiService.post<void>(ENDPOINTS.VOTE(sessionId, storyId), { vote }),
    
  revealVotes: (sessionId: number, storyId: number) => 
    apiService.post<any>(ENDPOINTS.REVEAL(sessionId, storyId)),
    
  getSessionResults: (sessionId: number) => 
    apiService.get<any>(ENDPOINTS.RESULTS(sessionId)),
};

export default sessionService;