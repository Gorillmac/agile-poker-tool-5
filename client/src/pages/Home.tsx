import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Rocket, Users, Trello, Edit3, FileText, Bell } from 'lucide-react';

const Home: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section > div.animate-on-scroll');
    sections.forEach(section => {
      observerRef.current?.observe(section);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-8 md:p-12 shadow-card text-center animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Estimate Agile Stories with <span className="text-primary-600">Elegant</span> <span className="text-primary-600">Simplicity</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-800 mb-10 max-w-3xl mx-auto">
            Plan smarter sprints with real-time collaborative estimation, seamless integration, 
            whiteboards, and exports — all in one powerful tool for agile teams.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sessions" className="btn-gradient text-white font-medium text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
              Join A Session
            </Link>
            <Link href="/auth" className="bg-white text-primary-700 border-2 border-primary-500 font-medium text-lg px-8 py-3 rounded-full hover:bg-primary-50 transition-all duration-300">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-8 md:p-12 shadow-card animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-10">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-card">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">Create a Planning Session</h3>
              <p className="text-gray-700 text-center">Create a Planning Poker room and invite your team members to join remotely from anywhere in the world.</p>
            </div>
            
            <div className="card-hover bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-card">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">Estimate Together</h3>
              <p className="text-gray-700 text-center">Use real-time voting with Fibonacci cards and collaborate using our integrated whiteboard for seamless planning.</p>
            </div>
            
            <div className="card-hover bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-card">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">Sync & Export</h3>
              <p className="text-gray-700 text-center">Push estimation results directly to your systems and export your sessions to PDF or CSV format with just a few clicks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-8 md:p-12 shadow-card animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-10">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Features Built for Modern Agile Teams</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-hover bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-card">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Rocket className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Real-Time Collaboration</h3>
              </div>
              <p className="text-gray-700">Estimate tasks live with team members across different locations using instant, synchronized feedback.</p>
            </div>
            
            <div className="card-hover bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-card">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Multi-User Sessions</h3>
              </div>
              <p className="text-gray-700">Host multiple planning sessions with voting, re-voting, and detailed statistical analysis of results.</p>
            </div>
            
            <div className="card-hover bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-card">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Trello className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Trello Integration</h3>
              </div>
              <p className="text-gray-700">Import cards from Trello, sync estimates back, and keep everything up to date automatically.</p>
            </div>
            
            <div className="card-hover bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-card">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Edit3 className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Collaborative Whiteboard</h3>
              </div>
              <p className="text-gray-700">Use our integrated whiteboard with drawing tools, sticky notes, and real-time updates.</p>
            </div>
            
            <div className="card-hover bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-card">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Export Tools</h3>
              </div>
              <p className="text-gray-700">Export your sessions to CSV or styled PDF reports with charts and whiteboard snapshots.</p>
            </div>
            
            <div className="card-hover bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-card">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Bell className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Smart Notifications</h3>
              </div>
              <p className="text-gray-700">Get notified about session invites, voting starts/ends, and team activity in real-time on any device or network.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
