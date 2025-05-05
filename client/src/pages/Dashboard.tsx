import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'wouter';
import { 
  Users, 
  PlusCircle, 
  Clock, 
  ListChecks, 
  BarChart3, 
  Settings,
  Trello,
  ChevronRight
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Placeholder data for recent sessions
  const recentSessions = [
    { id: 1, name: 'Sprint 32 Planning', date: 'April 20, 2025', status: 'Completed', participants: 8 },
    { id: 2, name: 'Feature Estimation', date: 'April 18, 2025', status: 'In Progress', participants: 5 },
    { id: 3, name: 'Bug Backlog Review', date: 'April 15, 2025', status: 'Completed', participants: 6 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome banner */}
      <div className="glass rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || user?.username}!
          </h1>
          <p className="text-gray-600 mt-1">
            Your teams are waiting for your input.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="btn-gradient flex items-center" asChild>
            <Link href="/sessions">
              <PlusCircle className="mr-2 h-4 w-4" />
              Lekker New Session, Bru!
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/teams">
              <Card className="glass-light card-hover cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-primary-100 p-3 rounded-full mb-4">
                    <Users className="h-6 w-6 text-primary-700" />
                  </div>
                  <h3 className="font-medium">Create Team</h3>
                  <p className="text-sm text-gray-500 mt-1">Invite your okes to collaborate</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/sessions">
              <Card className="glass-light card-hover cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-primary-100 p-3 rounded-full mb-4">
                    <PlusCircle className="h-6 w-6 text-primary-700" />
                  </div>
                  <h3 className="font-medium">New Session</h3>
                  <p className="text-sm text-gray-500 mt-1">Start a planning session, lekker!</p>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="glass-light card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary-100 p-3 rounded-full mb-4">
                  <Trello className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="font-medium">Trello Sync</h3>
                <p className="text-sm text-gray-500 mt-1">Import cards for planning</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent sessions */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary-600" />
                Recent Planning Sessions
              </CardTitle>
              <CardDescription>
                Your recent planning activities and sessions
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map(session => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-700">#{session.id}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{session.name}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-3">{session.date}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            session.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">{session.participants}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full" asChild>
                        <Link href={`/sessions/${session.id}/waiting`}>
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/sessions">View All Sessions, Bru!</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Profile card */}
          <Card className="glass-primary overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-24 relative">
              <div className="absolute -bottom-10 left-6">
                <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || 'User'}`} />
                  <AvatarFallback>{getInitials(user?.name || user?.username || 'User')}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            <CardContent className="pt-12 pb-4">
              <h3 className="font-bold text-xl">{user?.name || user?.username}</h3>
              <p className="text-gray-500">{user?.email}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-500">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-gray-500">Teams</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/profile">
                  <Settings className="mr-2 h-4 w-4" /> 
                  Profile Settings
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Quick links */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <nav className="space-y-1">
                <div className="block">
                  <Link href="/sessions" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-white/80 transition-colors">
                    <ListChecks className="mr-2 h-5 w-5 text-primary-600" />
                    <span>All Sessions</span>
                  </Link>
                </div>
                <div className="block">
                  <Link href="/teams" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-white/80 transition-colors">
                    <Users className="mr-2 h-5 w-5 text-primary-600" />
                    <span>My Teams</span>
                  </Link>
                </div>
                <div className="block">
                  <Link href="/analytics" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-white/80 transition-colors">
                    <BarChart3 className="mr-2 h-5 w-5 text-primary-600" />
                    <span>Analytics</span>
                  </Link>
                </div>
                <div className="block">
                  <Link href="/profile" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-white/80 transition-colors">
                    <Settings className="mr-2 h-5 w-5 text-primary-600" />
                    <span>Profile Settings</span>
                  </Link>
                </div>
              </nav>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;