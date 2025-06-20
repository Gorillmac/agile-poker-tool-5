import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  async function onSubmit(data: LoginFormValues) {
    try {
      await login(data.username, data.password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        variant: "default",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
      console.error("Login failed:", error);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Auth form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue to Agile Poker</p>
          </div>
          
          <div className="glass rounded-2xl overflow-hidden shadow-glass p-8 mb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="johndoe" 
                          className="glass-light" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="glass-light"
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="rememberMe"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <label
                          htmlFor="rememberMe"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Remember me
                        </label>
                      </FormItem>
                    )}
                  />
                  
                  <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-800">
                    Forgot password?
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-gradient text-white font-medium py-6 px-4 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary-600 hover:text-primary-800 font-medium">
                  Create an account
                </Link>
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <button 
                  type="button"
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 glass-light hover:bg-white/60 text-gray-700 rounded-lg py-2.5 px-4 transition-colors duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
                
                <button 
                  type="button"
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg py-2.5 px-4 transition-colors duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="white" d="M20.007,3H3.993C3.445,3,3,3.445,3,3.993v16.013C3,20.555,3.445,21,3.993,21h8.621v-6.971h-2.346v-2.718h2.346V9.31 c0-2.325,1.42-3.591,3.494-3.591c0.993,0,1.847,0.074,2.096,0.107v2.43l-1.438,0.001c-1.128,0-1.346,0.536-1.346,1.323v1.734h2.69 l-0.35,2.718h-2.34V21h4.587C20.555,21,21,20.555,21,20.007V3.993C21,3.445,20.555,3,20.007,3z"/>
                  </svg>
                  <span>Sign in with Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Info/hero section */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-primary-500/10 to-secondary-500/20 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('@assets/heroBackground.svg')", opacity: 0.1 }}></div>
        <div className="relative flex flex-col justify-center h-full p-12">
          <div className="glass-primary p-8 rounded-xl max-w-lg">
            <h2 className="text-3xl font-bold text-primary-900 mb-6">Agile Poker Planning Tool</h2>
            <p className="text-lg text-gray-700 mb-8">
              Make your agile planning sessions more efficient and enjoyable. Collaborate with your team in real-time to estimate user stories and tasks.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Real-time collaboration with your team</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Multiple estimation methods (Fibonacci, T-Shirt sizes, etc.)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Integration with popular project management tools</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Detailed session history and analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
