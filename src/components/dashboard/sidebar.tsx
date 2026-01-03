"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  FolderKanban,
  FileText,
  Calendar,
  Database,
  MessageSquare,
  Shield,
  HelpCircle,
  LogIn,
  AlertCircle,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type SidebarChild = { title: string; href: string };
type SidebarItem = {
  title: string;
  href: string;
  icon: any;
  badge?: string | null;
  badgeVariant?: "secondary" | "destructive" | null;
  children?: SidebarChild[];
};

const sidebarGroups: { title: string; items: SidebarItem[] }[] = [
  {
    title: "General",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
        badge: "12",
        badgeVariant: "secondary",
      },
      {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
        children: [
          { title: "All Products", href: "/dashboard/products" },
          { title: "Add Product", href: "/dashboard/products/add-product" },
          { title: "Edit Product", href: "/dashboard/products/edit-product" },
          {
            title: "Delete Product",
            href: "/dashboard/products/delete-product",
          },
        ],
      },
      { title: "Projects", href: "/dashboard/projects", icon: FolderKanban },
      { title: "Documents", href: "/dashboard/documents", icon: FileText },
      {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
        badge: "3",
        badgeVariant: "secondary",
      },
      { title: "Auth Pages", href: "/dashboard/auth", icon: LogIn },
      { title: "Error Pages", href: "/dashboard/errors", icon: AlertCircle },
    ],
  },
  {
    title: "Others",
    items: [
      {
        title: "Messages",
        href: "/dashboard/messages",
        icon: MessageSquare,
        badge: "5",
        badgeVariant: "secondary",
      },
      { title: "Database", href: "/dashboard/database", icon: Database },
      {
        title: "Security",
        href: "/dashboard/security",
        icon: Shield,
        badge: "!",
        badgeVariant: "destructive",
      },
      { title: "Help", href: "/dashboard/help", icon: HelpCircle },
    ],
  },
];

interface SidebarProps {
  onMobileClose?: () => void;
}

export function AppSidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const handleLinkClick = () => {
    if (onMobileClose) onMobileClose();
  };

  const toggleParent = (href: string) => {
    setOpenMap((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  // Auto-open dropdown if you are inside that section
  useEffect(() => {
    const next: Record<string, boolean> = {};
    sidebarGroups.forEach((g) => {
      g.items.forEach((item) => {
        if (item.children?.length) {
          const inBranch =
            pathname === item.href || pathname.startsWith(item.href + "/");
          if (inBranch) next[item.href] = true;
        }
      });
    });
    setOpenMap((prev) => ({ ...prev, ...next }));
  }, [pathname]);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Dashboard</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent className="mt-1 space-y-0.5">
              <SidebarMenu className="space-y-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const hasChildren = !!item.children?.length;

                  const parentActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  const isOpen = !!openMap[item.href];

                  return (
                    <SidebarMenuItem key={item.href}>
                      {/* ✅ Parent */}
                      {hasChildren ? (
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={parentActive}
                          onClick={() => toggleParent(item.href)}
                        >
                          <Icon />
                          <span>{item.title}</span>
                          <ChevronDown
                            className={`ml-auto size-4 transition-transform ${
                              isOpen ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={pathname === item.href}
                          onClick={handleLinkClick}
                        >
                          <Link href={item.href}>
                            <Icon />
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant={item.badgeVariant || "secondary"}
                                className="ml-auto"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      )}

                      {/* ✅ Children dropdown */}
                      {hasChildren && (
                        <div
                          className={`overflow-hidden transition-all duration-200 ${
                            isOpen
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <SidebarMenuSub>
                            {item.children!.map((child) => (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === child.href}
                                  onClick={handleLinkClick}
                                >
                                  <Link href={child.href}>{child.title}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </div>
                      )}

                      {/* keep right-side action badge only for non-children items */}
                      {item.badge && !hasChildren && (
                        <SidebarMenuAction>
                          <Badge
                            variant={item.badgeVariant || "secondary"}
                            className="h-5 px-1.5 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        </SidebarMenuAction>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">John Doe</span>
                    <span className="truncate text-xs">
                      john.doe@example.com
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/avatar.png" alt="User" />
                      <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">John Doe</span>
                      <span className="truncate text-xs">
                        john.doe@example.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex size-2 rounded-full bg-green-500 mr-2" />
                  Online
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex size-2 rounded-full bg-yellow-500 mr-2" />
                  Away
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex size-2 rounded-full bg-gray-500 mr-2" />
                  Offline
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
