import React from 'react';
import { Link } from 'wouter';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: RegisterFormValues) {
    console.log(data);
    // Here you would typically call an API to register the user
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-5xl mx-auto">
      <div className="glass-dark rounded-2xl overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Get Started Today</h2>
            <p className="text-gray-300 mb-8">Create your account to start planning more efficiently with your team. Free for teams up to 5 members.</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          className="bg-white/10 border border-gray-700 text-white focus:ring-2 focus:ring-primary-500" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="you@example.com" 
                          className="bg-white/10 border border-gray-700 text-white focus:ring-2 focus:ring-primary-500" 
                          {...field} 
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
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-white/10 border border-gray-700 text-white focus:ring-2 focus:ring-primary-500" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-white/10 border border-gray-700 text-white focus:ring-2 focus:ring-primary-500" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full btn-gradient text-white font-medium py-3 px-4 rounded-lg"
                >
                  Create Account
                </Button>
              </form>
            </Form>
            
            <p className="text-gray-400 text-sm mt-6 text-center">
              Already have an account? <Link href="/login" className="text-primary-400 hover:text-primary-300">Log in</Link>
            </p>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/90 to-secondary-800/50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 max-w-xs">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                    SJ
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Sarah Johnson</p>
                    <p className="text-gray-300 text-sm">Product Owner</p>
                  </div>
                </div>
                <p className="text-gray-100 italic">"This tool has completely transformed how our remote team handles story point estimation. Highly recommended!"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
