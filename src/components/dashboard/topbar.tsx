"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppSwitcher } from "@/components/shared/app-switcher";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "./theme-switcher";
import { useAuth } from "@/context/AuthContext";

function getInitials(name: string) {
  const n = name.trim();
  if (!n) return "U";
  return n
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function Topbar() {
  const { user, logout } = useAuth();

  const displayName =
    typeof user?.username === "string" && user.username.trim()
      ? user.username
      : "Guest";
  const email =
    typeof user?.email === "string" && user.email.trim()
      ? user.email
      : "guest@example.com";
  const avatarUrl = typeof user?.photo === "string" ? user.photo : undefined;
  const initials = getInitials(displayName) || "GU";
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center max-w-md flex-1">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything"
            className="pl-10 pr-4 py-2 h-9 bg-muted/40 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <AppSwitcher />
        <ThemeSwitcher />
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 hover:bg-muted/50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-medium animate-pulse">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <Badge variant="secondary" className="text-xs">
                  3 New
                </Badge>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ✅ Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-8 w-8 ring-2 ring-background hover:ring-primary/20 transition-all">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem className="p-3 cursor-pointer hover:bg-muted/50 rounded-md transition-colors">
              👤 Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 cursor-pointer hover:bg-muted/50 rounded-md transition-colors">
              ⚙️ Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              className="p-3 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
              onClick={() => void logout()}
            >
              🚪 Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
