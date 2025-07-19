import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/ToastNotification";
import { useEffect, useState } from "react";
import { notificationService } from "@/services/notification-service";
import type { Notification } from "@/services/notification-service";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/movies", label: "Movies" },
];

const authLinks = [
  { to: "/bookings", label: "My Bookings" },
  { to: "/profile", label: "Profile" },
];

const Layout = () => {
  const { isAuthenticated, user, accessToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notification history when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id && accessToken) {
      notificationService.fetchNotifications(accessToken)
        .then((data) => {
          setNotifications((prev) => {
            // Merge and deduplicate by id
            const all = [...data, ...prev];
            const unique = all.reduce((acc: Notification[], curr) => {
              if (!acc.some((n) => n.id === curr.id)) acc.push(curr);
              return acc;
            }, []);
            // Sort by createdAt desc
            return unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          });
        })
        .catch(() => setNotifications([]));
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, user?.id, accessToken]);

  // Real-time notification
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      notificationService.connect(user.id, (data) => {
        setNotifications((prev) => {
          // Deduplicate by id
          if (!data.id) return prev;
          if (prev.some((n) => n.id === data.id)) return prev;
          return [
            {
              id: data.id,
              message: data.message,
              type: data.type,
              isRead: false,
              createdAt: data.createdAt || new Date().toISOString(),
            },
            ...prev,
          ];
        });
      });
    } else {
      notificationService.disconnect();
    }
    return () => {
      notificationService.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  const handleClickNotification = (n: Notification) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === n.id ? { ...item, isRead: true } : item
      )
    );
    // You can add navigation or modal logic here
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Mooyie
          </Link>

          {/* Desktop Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {[...navLinks, ...(isAuthenticated ? authLinks : [])].map(
                (link) => (
                  <NavigationMenuItem key={link.to}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={link.to}
                        className={cn(
                          "px-4 py-2 transition-colors hover:text-primary",
                          isActive(link.to) && "text-primary font-semibold"
                        )}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            {isAuthenticated && user?.id && (
              <NotificationBell
                notifications={notifications}
                onClickNotification={handleClickNotification}
              />
            )}
            {/* Auth dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserIcon className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-xl">Mooyie</SheetTitle>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  {[...navLinks, ...(isAuthenticated ? authLinks : [])].map(
                    (link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={cn(
                          "text-base hover:text-primary",
                          isActive(link.to) && "text-primary font-semibold"
                        )}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-background/80 backdrop-blur mt-auto">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">Mooyie</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
