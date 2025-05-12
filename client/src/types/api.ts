// User types
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

export interface Participant {
  id: number;
  name: string;
  avatar?: string;
  hasVoted: boolean;
  vote?: string;
  isActive: boolean;
}

export interface UserStory {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'voting' | 'completed';
  finalEstimate?: string;
}

export interface PlanningSession {
  id: number;
  name: string;
  team: string;
  createdBy: string;
  participants: number;
  status: 'active' | 'waiting' | 'scheduled';
  lastActive?: Date;
  scheduledFor?: Date;
  stories?: UserStory[];
}

export interface Team {
  id: number;
  name: string;
  description: string;
  members: number[];
  totalSessions: number;
  averageVelocity: number;
  createdAt: Date;
}

// API response types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface SessionResultsResponse {
  id: number;
  name: string;
  completedStories: number;
  totalStories: number;
  averageEstimate: number;
  totalEstimate: number;
  stories: Array<UserStory & { votes: Record<string, string> }>;
  participants: Participant[];
}

export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
}