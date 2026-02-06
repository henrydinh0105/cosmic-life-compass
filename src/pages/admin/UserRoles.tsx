import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { RefreshCw, Trash2, Plus, Shield, User, Search, Check } from "lucide-react";
import { toast } from "sonner";

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "user";
  created_at: string;
}

interface SearchedUser {
  id: string;
  email: string;
  created_at: string;
}

const UserRoles = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading, user } = useAdminAuth();
  const { fetchUserRoles, addUserRole, deleteUserRole, searchUsersByEmail } = useAnalytics();
  
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Add role dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<"admin" | "user">("admin");
  const [isAdding, setIsAdding] = useState(false);
  
  // Email search state
  const [emailSearch, setEmailSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchedUser | null>(null);

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchUserRoles();
    setRoles(data as UserRole[]);
    setIsLoading(false);
  }, [fetchUserRoles]);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  // Load roles on mount
  useEffect(() => {
    if (isAdmin) {
      loadRoles();
    }
  }, [isAdmin, loadRoles]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (emailSearch.trim().length >= 2) {
        setIsSearching(true);
        const result = await searchUsersByEmail(emailSearch.trim());
        setSearchResults(result.data as SearchedUser[]);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [emailSearch, searchUsersByEmail]);

  const handleDelete = async (id: string, userId: string) => {
    // Prevent deleting own admin role
    if (userId === user?.id) {
      toast.error("You cannot remove your own admin role");
      return;
    }

    setDeletingId(id);
    const result = await deleteUserRole(id);
    setDeletingId(null);

    if (result.success) {
      setRoles((prev) => prev.filter((r) => r.id !== id));
      toast.success("Role deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete role");
    }
  };

  const handleAddRole = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    // Check if user already has this role
    const existingRole = roles.find(r => r.user_id === selectedUser.id && r.role === newRole);
    if (existingRole) {
      toast.error(`User already has ${newRole} role`);
      return;
    }

    setIsAdding(true);
    const result = await addUserRole(selectedUser.id, newRole);
    setIsAdding(false);

    if (result.success) {
      toast.success("Role added successfully");
      setIsAddDialogOpen(false);
      setEmailSearch("");
      setSearchResults([]);
      setSelectedUser(null);
      setNewRole("admin");
      loadRoles();
    } else {
      toast.error(result.error || "Failed to add role");
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setEmailSearch("");
      setSearchResults([]);
      setSelectedUser(null);
      setNewRole("admin");
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">User Roles</h1>
            <p className="text-muted-foreground">
              Manage admin and user roles
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add User Role</DialogTitle>
                  <DialogDescription>
                    Search for a user by email and assign a role.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Email Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search User by Email</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Type email to search..."
                        value={emailSearch}
                        onChange={(e) => {
                          setEmailSearch(e.target.value);
                          setSelectedUser(null);
                        }}
                        className="pl-9"
                      />
                    </div>
                    
                    {/* Search Results */}
                    {isSearching && (
                      <div className="text-sm text-muted-foreground py-2">
                        Searching...
                      </div>
                    )}
                    
                    {!isSearching && searchResults.length > 0 && (
                      <div className="border rounded-lg max-h-48 overflow-y-auto">
                        {searchResults.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => setSelectedUser(u)}
                            className={`w-full text-left px-3 py-2 hover:bg-secondary transition-colors flex items-center justify-between ${
                              selectedUser?.id === u.id ? "bg-primary/10" : ""
                            }`}
                          >
                            <div>
                              <div className="font-medium text-sm">{u.email}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {u.id.slice(0, 8)}...
                              </div>
                            </div>
                            {selectedUser?.id === u.id && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {!isSearching && emailSearch.trim().length >= 2 && searchResults.length === 0 && (
                      <div className="text-sm text-muted-foreground py-2">
                        No users found matching "{emailSearch}"
                      </div>
                    )}
                    
                    {emailSearch.trim().length > 0 && emailSearch.trim().length < 2 && (
                      <div className="text-sm text-muted-foreground py-2">
                        Type at least 2 characters to search
                      </div>
                    )}
                  </div>

                  {/* Selected User Display */}
                  {selectedUser && (
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Selected User</div>
                      <div className="font-medium">{selectedUser.email}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-1">
                        ID: {selectedUser.id}
                      </div>
                    </div>
                  )}

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select value={newRole} onValueChange={(v) => setNewRole(v as "admin" | "user")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            User
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => handleDialogClose(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRole} disabled={isAdding || !selectedUser}>
                    {isAdding ? "Adding..." : "Add Role"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={loadRoles} 
              variant="outline" 
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-mono text-sm">
                        {role.user_id}
                        {role.user_id === user?.id && (
                          <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
                          role.role === "admin" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-secondary text-secondary-foreground"
                        }`}>
                          {role.role === "admin" ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          {role.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(role.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              disabled={deletingId === role.id || role.user_id === user?.id}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Role</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove the <strong>{role.role}</strong> role 
                                from this user? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(role.id, role.user_id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserRoles;
