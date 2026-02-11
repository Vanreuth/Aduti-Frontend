"use client";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";

interface UserUI {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  roleLabel: string;
  roleVariant: "default" | "secondary" | "outline";
  status: string;
  statusVariant: "default" | "destructive";
  joinDate: string;
  initials: string;
}

interface UserTableUIProps {
  users: UserUI[];
  loading?: boolean;
  onEdit?: (uid: string) => void;
  onDelete?: (uid: string) => void;
}

export default function UserTableUI({
  users = [],
  loading = false,
  onEdit,
  onDelete,
}: UserTableUIProps) {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your user accounts and permissions
          </p>
        </div>

        <Button>Add User</Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <div className="flex items-center gap-4 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone ?? "-"}</TableCell>

                  <TableCell>
                    <Badge variant={user.roleVariant}>{user.roleLabel}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={user.statusVariant}>{user.status}</Badge>
                  </TableCell>

                  <TableCell>{user.joinDate}</TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(user.uid)}
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
    </div>
  );
}
