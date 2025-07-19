import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Lock, Unlock } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminUsersThunk,
  changeUserStatusThunk,
} from "@/store/slices/userSlice";
import { toast } from "sonner";
import { ActionConfirmationDialog } from "@/components/ActionConfirmationDialog";

const roles = [
  { value: "all", label: "All Roles" },
  { value: "ADMIN", label: "Administrator" },
  { value: "USER", label: "User" },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const itemsPerPage = 7;

export default function UserManagement() {
  const dispatch = useAppDispatch();
  const { adminUsers } = useAppSelector((state) => state.user);
  const [nameSearch, setNameSearch] = useState("");
  const [debouncedNameSearch] = useDebounce(nameSearch, 500);
  const [emailSearch, setEmailSearch] = useState("");
  const [debouncedEmailSearch] = useDebounce(emailSearch, 500);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string | null;
    currentStatus: boolean;
    userName: string;
  }>({ open: false, userId: null, currentStatus: false, userName: "" });
  console.log(selectedStatus);

  // Fetch users from API
  useEffect(() => {
    dispatch(
      fetchAdminUsersThunk({
        page: currentPage,
        limit: itemsPerPage,
        name: debouncedNameSearch || undefined,
        email: debouncedEmailSearch || undefined,
        role: selectedRole !== "all" ? selectedRole : undefined,
        status:
          selectedStatus === "all"
            ? undefined
            : selectedStatus === "active"
            ? true
            : false,
      })
    );
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    debouncedNameSearch,
    debouncedEmailSearch,
    selectedRole,
    selectedStatus,
  ]);

  console.log(selectedStatus);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleNameSearchChange = (value: string) => {
    setNameSearch(value);
    setCurrentPage(1);
  };
  const handleEmailSearchChange = (value: string) => {
    setEmailSearch(value);
    setCurrentPage(1);
  };
  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };
  const handleClearFilters = () => {
    setNameSearch("");
    setEmailSearch("");
    setSelectedRole("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setStatusLoadingId(userId);
    try {
      await dispatch(
        changeUserStatusThunk({ id: userId, status: !currentStatus })
      ).unwrap();
      toast.success(
        !currentStatus
          ? "Unlock account successfully"
          : "Lock account successfully"
      );
    } catch (e) {
      toast.error(
        !currentStatus
          ? "Unlock account failed"
          : "Lock account failed"
      );
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleRequestToggleStatus = (userId: string, currentStatus: boolean, userName: string) => {
    setConfirmDialog({ open: true, userId, currentStatus, userName });
  };

  const handleConfirmToggleStatus = async () => {
    if (!confirmDialog.userId) return;
    await handleToggleStatus(confirmDialog.userId, confirmDialog.currentStatus);
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const users = adminUsers.data || [];
  const totalItems = adminUsers.total || 0;
  const totalPages = adminUsers.totalPages || 1;
  const loading = adminUsers.loading;
  // const error = adminUsers.error;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts in the system
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleClearFilters}>
            Refresh
          </Button>
        </div>
      </div>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            {/* Name search filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-user-name">Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter-user-name"
                  placeholder="Search by name..."
                  value={nameSearch}
                  onChange={(e) => handleNameSearchChange(e.target.value)}
                  className="pl-10"
                />
                {nameSearch !== debouncedNameSearch && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>
            {/* Email search filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-user-email">Email</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter-user-email"
                  placeholder="Search by email..."
                  value={emailSearch}
                  onChange={(e) => handleEmailSearchChange(e.target.value)}
                  className="pl-10"
                />
                {emailSearch !== debouncedEmailSearch && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>
            {/* Role filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-role">Role</Label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Status filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Clear filters button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            Displaying {users.length} out of {totalItems} users
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 dark:border-green-400"></div>
                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  Loading...
                </span>
              </div>
            </div>
          )}
          {/* {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )} */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={8}>
                        <div className="flex items-center space-x-4 p-4">
                          <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.role === "ADMIN"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {user.role === "ADMIN"
                            ? "Administrator"
                            : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.status ? (
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={user.status ? "destructive" : "outline"}
                          size="sm"
                          disabled={statusLoadingId === user.id}
                          onClick={() => handleRequestToggleStatus(user.id, user.status, user.name)}
                          className="flex items-center gap-1"
                        >
                          {statusLoadingId === user.id ? (
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-600 dark:border-neutral-400"></span>
                          ) : user.status ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Unlock className="w-4 h-4" />
                          )}
                          {user.status ? "Lock" : "Unlock"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Displaying {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} out of{" "}
              {totalItems} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ActionConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.currentStatus ? "Lock Account?" : "Unlock Account?"}
        description={`Are you sure you want to ${confirmDialog.currentStatus ? "lock" : "unlock"} the account of user "${confirmDialog.userName}" ?`}
        confirmText={confirmDialog.currentStatus ? "Lock" : "Unlock"}
        cancelText="Cancel"
        variant={confirmDialog.currentStatus ? "destructive" : "default"}
        icon={confirmDialog.currentStatus ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
        onConfirm={handleConfirmToggleStatus}
        loading={statusLoadingId === confirmDialog.userId}
      />
    </div>
  );
}
 