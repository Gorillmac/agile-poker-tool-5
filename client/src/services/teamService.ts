import { apiService } from './api';
import { Team, User } from '../types/api';

const ENDPOINTS = {
  TEAMS: '/teams',
  TEAM: (id: number) => `/teams/${id}`,
  TEAM_MEMBERS: (id: number) => `/teams/${id}/members`,
  TEAM_MEMBER: (teamId: number, userId: number) => `/teams/${teamId}/members/${userId}`,
};

export const teamService = {
  getAllTeams: () => 
    apiService.get<Team[]>(ENDPOINTS.TEAMS),
    
  getTeamById: (id: number) => 
    apiService.get<Team>(ENDPOINTS.TEAM(id)),
    
  createTeam: (team: Partial<Team>) => 
    apiService.post<Team>(ENDPOINTS.TEAMS, team),
    
  updateTeam: (id: number, teamData: Partial<Team>) => 
    apiService.put<Team>(ENDPOINTS.TEAM(id), teamData),
    
  deleteTeam: (id: number) => 
    apiService.delete<void>(ENDPOINTS.TEAM(id)),
    
  // Team members
  getTeamMembers: (teamId: number) => 
    apiService.get<User[]>(ENDPOINTS.TEAM_MEMBERS(teamId)),
    
  addTeamMember: (teamId: number, userId: number, role: string) => 
    apiService.post<void>(ENDPOINTS.TEAM_MEMBERS(teamId), { userId, role }),
    
  removeTeamMember: (teamId: number, userId: number) => 
    apiService.delete<void>(ENDPOINTS.TEAM_MEMBER(teamId, userId)),
};

export default teamService;