import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  Clock, 
  PlayCircle, 
  PauseCircle,
  Zap,
  Flag,
  CheckCircle2,
  MoreVertical,
  FileText,
  RefreshCw,
  Download,
  PieChart,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { getInitials } from "@/lib/utils";

// Card values for planning poker
const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?', '☕'];

type Participant = {
  id: number;
  name: string;
  avatar?: string;
  hasVoted: boolean;
  vote?: string;
  isActive: boolean;
}

type UserStory = {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'voting' | 'completed';
  finalEstimate?: string;
}

const PlanningSession = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // If no user, redirect to login
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isVotingRevealed, setIsVotingRevealed] = useState(false);
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [timer, setTimer] = useState(60); // 60 second timer
  const [timerActive, setTimerActive] = useState(false);
  
  // New states for activity diagram flow
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [discussionNotes, setDiscussionNotes] = useState('');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [sessionReport, setSessionReport] = useState('');
  const [isRevoting, setIsRevoting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Mock data
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 1, name: user?.name || user?.username || "You", avatar: undefined, hasVoted: false, isActive: true },
    { id: 2, name: "Alex Thompson", avatar: undefined, hasVoted: false, isActive: true },
    { id: 3, name: "Maria Garcia", avatar: undefined, hasVoted: false, isActive: true },
    { id: 4, name: "James Wilson", avatar: undefined, hasVoted: false, isActive: true },
    { id: 5, name: "Sarah Chen", avatar: undefined, hasVoted: false, isActive: true },
  ]);

  const [stories, setStories] = useState<UserStory[]>([
    { 
      id: 1, 
      title: "User Authentication Implementation", 
      description: "As a user, I want to be able to register, login, and manage my account so that I can access the system securely.", 
      status: 'voting'
    },
    { 
      id: 2, 
      title: "Dashboard Analytics View", 
      description: "As a project manager, I want to see team velocity and sprint progress on my dashboard so I can track project health.", 
      status: 'pending'
    },
    { 
      id: 3, 
      title: "API Integration with Payment Gateway", 
      description: "As a system administrator, I want to integrate with multiple payment processors so users can choose their preferred payment method.", 
      status: 'pending'
    },
  ]);

  // Current story being estimated
  const currentStory = stories.find(story => story.status === 'voting');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      // Auto-reveal when timer reaches 0
      setIsVotingRevealed(true);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  // Handle card selection
  const handleCardSelect = (value: string) => {
    setSelectedCard(value);
    
    // Update the current user's vote
    setParticipants(prevParticipants => 
      prevParticipants.map(participant => 
        participant.id === 1
          ? { ...participant, hasVoted: true, vote: value }
          : participant
      )
    );

    // Simulate other participants voting with a delay
    if (isVotingActive) {
      simulateOtherParticipantsVoting();
    }
  };

  // Simulate voting by other participants
  const simulateOtherParticipantsVoting = () => {
    // Set random voting times for each participant
    participants.forEach((participant, index) => {
      if (participant.id !== 1) { // Skip the current user
        const randomDelay = Math.floor(Math.random() * 10000) + 2000; // 2-12 seconds
        
        setTimeout(() => {
          const randomCardIndex = Math.floor(Math.random() * CARD_VALUES.length);
          
          setParticipants(prevParticipants => 
            prevParticipants.map(p => 
              p.id === participant.id
                ? { ...p, hasVoted: true, vote: CARD_VALUES[randomCardIndex] }
                : p
            )
          );
        }, randomDelay);
      }
    });
  };

  // Start voting session
  const startVoting = () => {
    setIsVotingActive(true);
    setIsVotingRevealed(false);
    setSelectedCard(null);
    setTimer(60);
    setTimerActive(true);
    
    // Reset all votes
    setParticipants(prevParticipants => 
      prevParticipants.map(participant => ({
        ...participant,
        hasVoted: false,
        vote: undefined
      }))
    );
  };

  // End voting and reveal cards
  const endVoting = () => {
    setIsVotingActive(false);
    setIsVotingRevealed(true);
    setTimerActive(false);
  };

  // Save estimation and move to next story
  const saveEstimation = (value: string) => {
    if (currentStory) {
      // Update the current story
      setStories(prevStories => 
        prevStories.map(story => 
          story.id === currentStory.id
            ? { ...story, status: 'completed', finalEstimate: value }
            : story
        )
      );
      
      // Set next story to voting status
      const currentIndex = stories.findIndex(story => story.id === currentStory.id);
      if (currentIndex < stories.length - 1) {
        setStories(prevStories => 
          prevStories.map((story, index) => 
            index === currentIndex + 1
              ? { ...story, status: 'voting' }
              : story
          )
        );
      }
      
      // Reset voting state
      setIsVotingActive(false);
      setIsVotingRevealed(false);
      setSelectedCard(null);
    }
  };

  // Calculate consensus percentage
  const calculateConsensus = () => {
    const votedParticipants = participants.filter(p => p.hasVoted);
    if (votedParticipants.length <= 1) return 100; // Single voter or none
    
    const voteValues = votedParticipants.map(p => p.vote);
    const mostCommonVote = voteValues
      .filter(v => v !== '?' && v !== '☕') // Filter out non-numeric votes
      .sort((a, b) => 
        voteValues.filter(v => v === a).length - voteValues.filter(v => v === b).length
      ).pop();
    
    const consensusCount = voteValues.filter(v => v === mostCommonVote).length;
    return Math.round((consensusCount / votedParticipants.length) * 100);
  };

  // Get the consensus estimate
  const getConsensusEstimate = () => {
    const votedParticipants = participants.filter(p => p.hasVoted);
    if (votedParticipants.length === 0) return null;
    
    const numericVotes = votedParticipants
      .map(p => p.vote)
      .filter(v => v !== '?' && v !== '☕')
      .map(v => parseInt(v || '0'));
    
    if (numericVotes.length === 0) return '?';
    
    // Sort the votes and get the median
    numericVotes.sort((a, b) => a - b);
    const mid = Math.floor(numericVotes.length / 2);
    
    if (numericVotes.length % 2 === 0) {
      // Even number of votes, average the middle two
      const median = (numericVotes[mid - 1] + numericVotes[mid]) / 2;
      // Find the closest Fibonacci value
      const fibValues = [0, 1, 2, 3, 5, 8, 13, 21, 34];
      return fibValues.reduce((prev, curr) => 
        Math.abs(curr - median) < Math.abs(prev - median) ? curr : prev
      ).toString();
    } else {
      // Odd number of votes, return the middle one
      return numericVotes[mid].toString();
    }
  };

  // Check if there's consensus (aligned with activity diagram)
  const hasConsensus = () => {
    return calculateConsensus() >= 75; // 75% or more agreement is considered consensus
  };

  // Start discussion when there's disagreement 
  const startDiscussion = () => {
    setIsDiscussionOpen(true);
  };

  // Close discussion and start revoting
  const startRevote = () => {
    setIsDiscussionOpen(false);
    setIsRevoting(true);
    startVoting(); // Restart the voting process
  };

  // Generate session report based on completed stories
  const generateReport = () => {
    const completedStories = stories.filter(s => s.status === 'completed');
    const totalPoints = completedStories.reduce((total, story) => 
      total + (parseInt(story.finalEstimate || '0') || 0), 0
    );
    
    const report = `
# Agile Planning Poker Session Report
**Date:** ${new Date().toLocaleDateString()}
**Participants:** ${participants.map(p => p.name).join(', ')}

## Estimated Stories
${completedStories.map(story => `
### ${story.title}
**Description:** ${story.description}
**Final Estimate:** ${story.finalEstimate} points
`).join('\n')}

## Summary
**Total Stories:** ${completedStories.length}
**Total Story Points:** ${totalPoints}
**Average Points Per Story:** ${(totalPoints / completedStories.length).toFixed(1)}
    `;
    
    setSessionReport(report);
    setShowReportDialog(true);
  };
  
  // Export the report 
  const exportReport = () => {
    // Create a downloadable text file
    const element = document.createElement('a');
    const file = new Blob([sessionReport], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `agile-poker-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setShowReportDialog(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary-900">Planning Poker Session</h1>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center gap-1 py-1">
                <Users className="h-4 w-4" />
                <span>{participants.filter(p => p.isActive).length} Active</span>
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-1 py-1">
                <Flag className="h-4 w-4" />
                <span>{stories.filter(s => s.status === 'completed').length}/{stories.length} Completed</span>
              </Badge>
            </div>
          </div>
          
          <Separator className="my-4" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - User stories */}
          <div className="lg:col-span-1">
            <div className="glass rounded-lg overflow-hidden">
              <div className="bg-primary-50/50 px-4 py-3 border-b">
                <h2 className="text-lg font-semibold flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary-600" />
                  User Stories
                </h2>
              </div>
              
              <div className="p-4 space-y-4">
                {stories.map(story => (
                  <div 
                    key={story.id} 
                    className={`p-3 rounded-md border ${
                      story.status === 'voting' 
                        ? 'bg-primary-50 border-primary-300' 
                        : story.status === 'completed'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900">{story.title}</h3>
                      
                      {story.status === 'completed' && (
                        <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                          {story.finalEstimate} points
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{story.description}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <Badge 
                        variant={
                          story.status === 'voting' 
                            ? 'default' 
                            : story.status === 'completed'
                              ? 'outline' 
                              : 'secondary'
                        }
                        className={
                          story.status === 'voting' 
                            ? 'bg-primary-500' 
                            : story.status === 'completed'
                              ? 'border-green-500 text-green-700' 
                              : ''
                        }
                      >
                        {story.status === 'voting' ? 'Current' : 
                          story.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Middle column - Current story and voting */}
          <div className="lg:col-span-2">
            {currentStory ? (
              <div>
                <div className="glass rounded-lg mb-6">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{currentStory.title}</h2>
                        <p className="text-gray-600 mt-2">{currentStory.description}</p>
                      </div>
                      
                      <div>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" /> Comments
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-24 flex items-center ${timerActive ? 'text-amber-600' : 'text-gray-500'}`}>
                          <Clock className="h-5 w-5 mr-1" />
                          <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                        </div>
                        
                        <Button 
                          variant={timerActive ? "destructive" : "default"}
                          size="sm"
                          className="ml-2"
                          onClick={() => setTimerActive(!timerActive)}
                        >
                          {timerActive ? (
                            <><PauseCircle className="h-4 w-4 mr-1" /> Pause</>
                          ) : (
                            <><PlayCircle className="h-4 w-4 mr-1" /> Start Timer</>
                          )}
                        </Button>
                      </div>
                      
                      <div>
                        {isVotingActive ? (
                          <Button 
                            variant="default" 
                            onClick={endVoting}
                            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                          >
                            Reveal Cards
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            onClick={startVoting}
                            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                          >
                            Start Voting
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Voting area */}
                <div className="glass rounded-lg mb-6">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Estimation Cards</h3>
                    
                    <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
                      {CARD_VALUES.map(value => (
                        <Card 
                          key={value} 
                          className={`aspect-[2/3] cursor-pointer transition-all transform hover:scale-105 ${
                            selectedCard === value 
                              ? 'ring-2 ring-primary-500 shadow-lg scale-105' 
                              : 'hover:shadow-md'
                          } ${isVotingActive ? '' : 'opacity-60 pointer-events-none'}`}
                          onClick={() => isVotingActive && handleCardSelect(value)}
                        >
                          <CardContent className="p-0 flex items-center justify-center h-full">
                            <span className="text-xl font-bold">{value}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <div className="mb-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Team Consensus</span>
                        <span className="text-sm font-medium">{calculateConsensus()}%</span>
                      </div>
                      <Progress value={calculateConsensus()} className="h-2" />
                    </div>
                  </div>
                </div>
                
                {/* Participants and results */}
                <div className="glass rounded-lg">
                  <Tabs defaultValue="participants">
                    <div className="px-6 pt-4 border-b">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="participants">Participants</TabsTrigger>
                        <TabsTrigger value="results" disabled={!isVotingRevealed}>Results</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="participants" className="p-0">
                      <div className="p-6">
                        <div className="space-y-4">
                          {participants.map(participant => (
                            <div key={participant.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={participant.avatar} />
                                  <AvatarFallback className="bg-primary-100 text-primary-700">
                                    {getInitials(participant.name)}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div>
                                  <p className="font-medium">{participant.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {participant.hasVoted 
                                      ? isVotingRevealed 
                                        ? `Voted: ${participant.vote}` 
                                        : 'Has voted' 
                                      : 'Not voted yet'}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                {participant.hasVoted && !isVotingRevealed && (
                                  <div className="h-6 w-6 bg-primary-100 rounded-md flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4 text-primary-600" />
                                  </div>
                                )}
                                
                                {participant.hasVoted && isVotingRevealed && (
                                  <div className="h-8 w-8 bg-white rounded-md border shadow-sm flex items-center justify-center">
                                    <span className="font-bold text-lg">
                                      {participant.vote}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="results" className="p-0">
                      <div className="p-6">
                        {isVotingRevealed && (
                          <div>
                            <div className="text-center py-6">
                              <h3 className="text-lg text-gray-700 mb-2">Consensus Estimate</h3>
                              <div className="inline-flex items-center justify-center h-20 w-20 bg-primary-50 rounded-full border-2 border-primary-300">
                                <span className="text-3xl font-bold text-primary-700">{getConsensusEstimate() || '?'}</span>
                              </div>
                              
                              <p className="mt-2 text-sm text-gray-500">
                                {calculateConsensus()}% team consensus
                              </p>
                            </div>
                            
                            <div className="flex justify-center space-x-4 mt-4">
                              {hasConsensus() ? (
                                <>
                                  <Button 
                                    variant="outline"
                                    onClick={() => startVoting()}
                                  >
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Vote Again
                                  </Button>
                                  
                                  <Button 
                                    onClick={() => saveEstimation(getConsensusEstimate() || '?')}
                                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Accept & Continue
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline"
                                    onClick={startDiscussion}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Discuss Discrepancies
                                  </Button>
                                  
                                  <Button 
                                    onClick={() => startRevote()}
                                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                                  >
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Revote
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="glass rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Session Complete</h3>
                <p className="text-gray-600">All user stories have been estimated.</p>
                
                <div className="flex flex-col items-center mt-6 space-y-4">
                  <Button 
                    onClick={generateReport}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Generate Report
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Reset stories
                      setStories(prevStories => 
                        prevStories.map((story, index) => ({
                          ...story,
                          status: index === 0 ? 'voting' : 'pending',
                          finalEstimate: undefined
                        }))
                      );
                    }}
                  >
                    Start New Session
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Discussion Dialog */}
      <AlertDialog open={isDiscussionOpen} onOpenChange={setIsDiscussionOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Team Discussion</AlertDialogTitle>
            <AlertDialogDescription>
              The team doesn't have consensus on this story. Discuss the different perspectives to reach a common understanding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Discussion Notes</h3>
              <Textarea 
                placeholder="Capture key points from the discussion..." 
                className="min-h-[120px]"
                value={discussionNotes}
                onChange={(e) => setDiscussionNotes(e.target.value)}
              />
            </div>
            
            <div className="p-4 bg-amber-50 rounded-md border border-amber-200">
              <h3 className="text-sm font-medium flex items-center text-amber-800">
                <PieChart className="h-4 w-4 mr-1" />
                Voting Distribution
              </h3>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {Array.from(new Set(participants.filter(p => p.hasVoted).map(p => p.vote))).map(vote => {
                  const count = participants.filter(p => p.vote === vote).length;
                  return (
                    <div key={vote} className="text-center">
                      <div className="bg-white rounded-md border shadow-sm h-8 w-8 flex items-center justify-center mx-auto">
                        <span className="font-bold">{vote}</span>
                      </div>
                      <div className="text-xs mt-1 text-gray-600">{count} votes</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={startRevote}>Start Revote</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Report Dialog */}
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Session Report</AlertDialogTitle>
            <AlertDialogDescription>
              Review and export the summary of this planning session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <div className="bg-white border rounded-md p-4 max-h-[400px] overflow-y-auto font-mono text-sm whitespace-pre-wrap" ref={reportRef}>
              {sessionReport}
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={exportReport}>
              <Download className="h-4 w-4 mr-1" />
              Export Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlanningSession;