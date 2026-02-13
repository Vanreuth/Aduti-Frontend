"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TablePagination } from "@/components/dashboard/table-pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUserByAdmin,
  deleteUserByAdmin,
  getUserById,
  getUsers,
  updateUserByAdmin,
  type AdminCreateUserPayload,
  type AdminUpdateUserPayload,
  type DashboardUser,
} from "@/lib/api/user";
import { toast } from "sonner";

interface UserFormData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  bio: string;
  enable: boolean;
  roleIdsInput: string;
}

const ROLE_NAME_TO_ID: Record<string, number> = {
  ADMIN: 1,
  USER: 2,
};

function getRoleBadgeVariant(roles: string[]): "default" | "secondary" | "outline" {
  if (roles.includes("ADMIN")) return "default";
  if (roles.includes("USER")) return "secondary";
  return "outline";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function parseRoleIds(value: string): number[] | null {
  const values = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (values.length === 0) return null;

  const roleIds: number[] = [];
  for (const raw of values) {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) return null;
    roleIds.push(id);
  }

  return Array.from(new Set(roleIds));
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

function createEmptyFormData(): UserFormData {
  return {
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    bio: "",
    enable: true,
    roleIdsInput: "1",
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<DashboardUser | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>(createEmptyFormData());
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers({
        page: Math.max(0, currentPage - 1),
        size: pageSize,
      });
      setUsers(data.content ?? []);
      setTotalPages(Math.max(1, data.totalPages ?? 1));
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to load users");
      setError(message);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers, refreshKey]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      return (
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phoneNumber ?? "").toLowerCase().includes(query) ||
        (user.address ?? "").toLowerCase().includes(query) ||
        user.roles.some((role) => role.toLowerCase().includes(query))
      );
    });
  }, [users, searchTerm]);

  const openUserDetail = async (id: number) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailUser(null);

    try {
      const user = await getUserById(id);
      setDetailUser(user);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to load user detail");
      setDetailError(message);
      toast.error("Load user failed", { description: message });
    } finally {
      setDetailLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedUser(null);
    setFormError(null);
    setFormData(createEmptyFormData());
    setIsFormOpen(true);
  };

  const openEditModal = (user: DashboardUser) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormError(null);

    const mappedRoleIds = user.roles
      .map((role) => ROLE_NAME_TO_ID[role.toUpperCase()])
      .filter((id): id is number => typeof id === "number");

    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      phoneNumber: user.phoneNumber ?? "",
      address: user.address ?? "",
      bio: user.bio ?? "",
      enable: user.enable,
      roleIdsInput: mappedRoleIds.length ? mappedRoleIds.join(",") : "1",
    });

    setIsFormOpen(true);
  };

  const openDeleteModal = (user: DashboardUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const username = formData.username.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();
    const roleIds = parseRoleIds(formData.roleIdsInput);

    if (!username) {
      setFormError("Username is required.");
      return;
    }

    if (!email) {
      setFormError("Email is required.");
      return;
    }

    if (!roleIds) {
      setFormError("Role IDs are required (example: 1 or 1,2).");
      return;
    }

    if (modalMode === "add" && password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (modalMode === "add") {
        const payload: AdminCreateUserPayload = {
          username,
          email,
          password,
          phoneNumber: formData.phoneNumber.trim() || undefined,
          address: formData.address.trim() || undefined,
          bio: formData.bio.trim() || undefined,
          roleIds,
        };

        await createUserByAdmin(payload);
        toast.success("User created", {
          description: `${username} was created successfully.`,
        });
        setCurrentPage(1);
      } else {
        if (!selectedUser) {
          setFormError("No user selected for update.");
          return;
        }

        const payload: AdminUpdateUserPayload = {
          username,
          email,
          phoneNumber: formData.phoneNumber.trim() || undefined,
          address: formData.address.trim() || undefined,
          bio: formData.bio.trim() || undefined,
          enable: formData.enable,
          roleIds,
        };

        if (password) {
          payload.password = password;
        }

        await updateUserByAdmin(selectedUser.id, payload);
        toast.success("User updated", {
          description: `${username} was updated successfully.`,
        });
      }

      setIsFormOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        modalMode === "add" ? "Failed to create user" : "Failed to update user",
      );
      setFormError(message);
      toast.error(modalMode === "add" ? "Create user failed" : "Update user failed", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) {
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUserByAdmin(selectedUser.id);
      setIsDeleteModalOpen(false);
      setRefreshKey((value) => value + 1);
      toast.success("User deleted", {
        description: `${selectedUser.username} was deleted successfully.`,
      });
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete user");
      toast.error("Delete user failed", { description: message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>

        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="rounded-md border p-4">
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name, email, phone, role, address..."
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-4 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photo ?? undefined} alt={user.username} />
                        <AvatarFallback>{getInitials(user.username) || "?"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber ?? "-"}</TableCell>

                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.roles)}>
                      {user.roles[0] ?? "USER"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={user.enable ? "default" : "destructive"}>
                      {user.enable ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>{user.address?.trim() || "-"}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => void openUserDetail(user.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteModal(user)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Data loaded from <code>/api/users/:id</code>
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center rounded-md border bg-muted/30 py-12 text-sm text-muted-foreground">
              Loading user detail...
            </div>
          ) : detailError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {detailError}
            </div>
          ) : detailUser ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 border">
                      <AvatarImage src={detailUser.photo ?? undefined} alt={detailUser.username} />
                      <AvatarFallback>{getInitials(detailUser.username) || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold leading-tight">{detailUser.username}</p>
                      <p className="text-sm text-muted-foreground break-all">{detailUser.email}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge variant={detailUser.enable ? "default" : "destructive"}>
                          {detailUser.enable ? "Active" : "Inactive"}
                        </Badge>
                        {(detailUser.roles.length ? detailUser.roles : ["USER"]).map((role) => (
                          <Badge key={`${detailUser.id}-${role}`} variant={getRoleBadgeVariant([role])}>
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border bg-background px-3 py-2 text-right">
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <p className="text-lg font-semibold">#{detailUser.id}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{detailUser.phoneNumber || "-"}</p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium">{detailUser.address?.trim() || "-"}</p>
                </div>
                <div className="rounded-md border bg-muted/10 p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Bio</p>
                  <p className="whitespace-pre-wrap text-sm font-medium">
                    {detailUser.bio?.trim() || "No bio provided."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No detail data.</p>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              disabled={detailLoading || !!detailError || !detailUser}
              onClick={() => {
                if (!detailUser) return;
                openEditModal(detailUser);
                setIsDetailOpen(false);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              disabled={detailLoading || !!detailError || !detailUser}
              onClick={() => {
                if (!detailUser) return;
                openDeleteModal(detailUser);
                setIsDetailOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setFormError(null);
            setIsSubmitting(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>{modalMode === "add" ? "Add User" : "Edit User"}</DialogTitle>
            <DialogDescription>
              {modalMode === "add"
                ? "Create a new user using /api/users"
                : "Update user using /api/users/{id}"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, username: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="password">
                  Password {modalMode === "edit" ? "(optional)" : ""}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, password: event.target.value }))
                  }
                  placeholder={modalMode === "edit" ? "Leave empty to keep current" : "At least 6 characters"}
                  required={modalMode === "add"}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, phoneNumber: event.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="roleIds">Role IDs</Label>
                <Input
                  id="roleIds"
                  value={formData.roleIdsInput}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, roleIdsInput: event.target.value }))
                  }
                  placeholder="Example: 1 or 1,2"
                  required
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, address: event.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, bio: event.target.value }))
                  }
                  className="min-h-[90px]"
                />
              </div>

              {modalMode === "edit" ? (
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="enable">Enabled</Label>
                  <Select
                    value={String(formData.enable)}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, enable: value === "true" }))
                    }
                  >
                    <SelectTrigger id="enable">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Enabled</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : modalMode === "add"
                    ? "Create User"
                    : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedUser?.username}</strong>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
