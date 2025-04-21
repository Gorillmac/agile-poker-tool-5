import React from "react";
import { Route, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
};

// This is a wrapper component that checks authentication
const ProtectedComponent = ({ component: Component }: { component: React.ComponentType }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-primary/30 p-8 rounded-xl shadow-card flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
};

// This component just adds a Route with the protected component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, component }) => {
  return <Route path={path} component={() => <ProtectedComponent component={component} />} />;
};