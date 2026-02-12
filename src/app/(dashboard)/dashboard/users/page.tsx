"use client";

import { useCallback, useEffect, useState } from "react";
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
import { MoreHorizontal } from "lucide-react";
import { TablePagination } from "@/components/dashboard/table-pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserById, getUsers, type DashboardUser } from "@/lib/api/user";
import { toast } from "sonner";

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

export default function UsersPage() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<DashboardUser | null>(null);

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
      const message = err instanceof Error ? err.message : "Failed to load users";
      setError(message);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const openUserDetail = async (id: number) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailUser(null);

    try {
      const user = await getUserById(id);
      setDetailUser(user);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load user detail";
      setDetailError(message);
      toast.error("Load user failed", { description: message });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your user accounts and permissions
          </p>
        </div>

        <Button disabled>Add User</Button>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void openUserDetail(user.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Data loaded from <code>/api/users/:id</code>
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <p className="text-sm text-muted-foreground">Loading user detail...</p>
          ) : detailError ? (
            <p className="text-sm text-destructive">{detailError}</p>
          ) : detailUser ? (
            <div className="grid gap-3 text-sm">
              <div>
                <span className="font-medium">ID:</span> {detailUser.id}
              </div>
              <div>
                <span className="font-medium">Username:</span> {detailUser.username}
              </div>
              <div>
                <span className="font-medium">Email:</span> {detailUser.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span>{" "}
                {detailUser.phoneNumber || "-"}
              </div>
              <div>
                <span className="font-medium">Address:</span>{" "}
                {detailUser.address?.trim() || "-"}
              </div>
              <div>
                <span className="font-medium">Bio:</span> {detailUser.bio || "-"}
              </div>
              <div>
                <span className="font-medium">Roles:</span>{" "}
                {detailUser.roles.length ? detailUser.roles.join(", ") : "USER"}
              </div>
              <div>
                <span className="font-medium">Enabled:</span>{" "}
                {detailUser.enable ? "Yes" : "No"}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No detail data.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
