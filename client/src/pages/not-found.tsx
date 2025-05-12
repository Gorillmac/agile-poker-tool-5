import { Link } from "wouter";
import { Construction, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4">
      <div className="glass-dark max-w-md w-full mx-auto rounded-2xl overflow-hidden shadow-glass">
        <div className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20 rounded-full"></div>
              <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-full">
                <Construction className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Coming Soon</h1>
          <h2 className="text-xl font-medium text-gray-300 mb-6">Under Construction</h2>
          
          <p className="text-gray-400 mb-8">
            We're currently working on this feature. Please check back later!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary flex items-center gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="bg-transparent border border-gray-500 text-gray-300 hover:bg-white/5 flex items-center gap-2">
              <a href="#" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </a>
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 py-4 px-8 border-t border-white/10">
          <p className="text-sm text-center text-gray-400">
            Need help? <Link href="/" className="text-primary-400 hover:text-primary-300">Return to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
