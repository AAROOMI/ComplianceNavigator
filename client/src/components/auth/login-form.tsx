import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, Shield, User, Lock, Building } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess: (user: any) => void;
  onSignupRequest: () => void;
}

export default function LoginForm({ onLoginSuccess, onSignupRequest }: LoginFormProps) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', data);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.firstName || response.user.username}!`,
      });
      
      // Store authentication state
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      onLoginSuccess(response.user);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo users for testing
  const demoUsers = [
    { username: "admin", password: "admin123", role: "Super Admin", description: "Full system access" },
    { username: "ciso", password: "ciso123", role: "CISO", description: "Security policy management" },
    { username: "itmanager", password: "it123", role: "IT Manager", description: "IT operations and infrastructure" },
    { username: "analyst", password: "analyst123", role: "Security Analyst", description: "Risk assessment and analysis" },
    { username: "auditor", password: "audit123", role: "Auditor", description: "Compliance and audit access" },
  ];

  const fillDemoCredentials = (username: string, password: string) => {
    form.setValue("username", username);
    form.setValue("password", password);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Welcome to MetaWorks</CardTitle>
            <CardDescription>
              Sign in to access your cybersecurity compliance platform
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your username"
                        data-testid="input-username"
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
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          data-testid="input-password"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00adb5] to-[#00c896] hover:from-[#009ba3] to-[#00b085]"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-[#00adb5] hover:text-[#009ba3]"
                onClick={onSignupRequest}
                data-testid="button-signup-request"
              >
                Sign up here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Demo Credentials */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building className="w-5 h-5" />
            Demo Credentials
          </CardTitle>
          <CardDescription>
            Click any credential below to auto-fill the login form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {demoUsers.map((user) => (
              <Button
                key={user.username}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto p-3"
                onClick={() => fillDemoCredentials(user.username, user.password)}
                data-testid={`button-demo-${user.role.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <strong>{user.username}</strong>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {user.description}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}