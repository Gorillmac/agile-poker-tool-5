import { useEffect } from "react";
import { Route, useLocation, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, component: Component }) => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // This component renders a Route that either renders the protected component
  // if the user is authenticated, or redirects to the login page
  return (
    <Route
      path={path}
      render={() => {
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
      }}
    />
  );
};