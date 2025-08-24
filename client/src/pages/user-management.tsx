import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUsersManagementSchema, type UsersManagement, type InsertUsersManagement } from "@shared/schema";
import { z } from "zod";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  Calendar,
  Settings,
  Shield,
  Rocket,
  Monitor
} from "lucide-react";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingUser, setEditingUser] = useState<UsersManagement | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users-management"],
    queryFn: () => apiRequest<UsersManagement[]>("GET", "/api/users-management"),
  });

  // Create extended schema for form validation that handles null values
  const formSchema = insertUsersManagementSchema.extend({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    department: z.string().optional(),
    phoneNumber: z.string().optional(),
  });

  // Form for creating/editing users  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      role: "user",
      department: "",
      isActive: true,
      phoneNumber: "",
      preferences: {}
    }
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: InsertUsersManagement) => 
      apiRequest("POST", "/api/users-management", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users-management"] });
      setShowCreateDialog(false);
      form.reset();
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<InsertUsersManagement> }) =>
      apiRequest("PUT", `/api/users-management/${id}`, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users-management"] });
      setEditingUser(null);
      form.reset();
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/users-management/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users-management"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle form submission
  const onSubmit = (data: InsertUsersManagement) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, userData: data });
    } else {
      createUserMutation.mutate(data);
    }
  };

  // Start editing user
  const startEdit = (user: UsersManagement) => {
    setEditingUser(user);
    form.reset({
      username: user.username,
      email: user.email,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      role: user.role,
      department: user.department ?? "",
      isActive: user.isActive,
      phoneNumber: user.phoneNumber ?? "",
      preferences: user.preferences ?? {}
    });
  };

  // Get role badge variant and icon
  const getRoleInfo = (role: string) => {
    const roleMap = {
      admin: { variant: "destructive" as const, icon: Shield },
      ciso: { variant: "default" as const, icon: Shield },
      "it-manager": { variant: "secondary" as const, icon: Settings },
      cto: { variant: "outline" as const, icon: Rocket },
      sysadmin: { variant: "outline" as const, icon: Monitor },
      user: { variant: "outline" as const, icon: Users }
    };
    return roleMap[role as keyof typeof roleMap] || roleMap.user;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          User Management
        </h1>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Create New User"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="john.doe" />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="john.doe@company.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Doe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="ciso">CISO</SelectItem>
                          <SelectItem value="it-manager">IT Manager</SelectItem>
                          <SelectItem value="cto">CTO</SelectItem>
                          <SelectItem value="sysadmin">System Administrator</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="IT Security" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+1 (555) 123-4567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowCreateDialog(false);
                      setEditingUser(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createUserMutation.isPending || updateUserMutation.isPending}
                  >
                    {editingUser ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="ciso">CISO</SelectItem>
                <SelectItem value="it-manager">IT Manager</SelectItem>
                <SelectItem value="cto">CTO</SelectItem>
                <SelectItem value="sysadmin">System Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role);
                const RoleIcon = roleInfo.icon;
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <RoleIcon className="w-5 h-5 text-primary" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                          <Badge variant={roleInfo.variant}>{user.role}</Badge>
                          {user.isActive ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <UserX className="w-3 h-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </span>
                          {user.phoneNumber && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.phoneNumber}
                            </span>
                          )}
                          {user.department && (
                            <span>{user.department}</span>
                          )}
                        </div>
                        
                        {user.lastLogin && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            Last login: {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          startEdit(user);
                          setShowCreateDialog(true);
                        }}
                        data-testid={`button-edit-user-${user.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUserMutation.mutate(user.id)}
                        disabled={deleteUserMutation.isPending}
                        data-testid={`button-delete-user-${user.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}