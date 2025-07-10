import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  Edit,
  Camera,
  Star,
  Clock,
  Film,
  Ticket,
  Save,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile } from "@/store/slices/userSlice";
import { toast } from "sonner";
import { setUser } from "@/store/slices/authSlice";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("activity");
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [editForm, setEditForm] = useState(() => ({
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  }));

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", editForm);
    if (!editForm.name || !editForm.email || !editForm.phone) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!editForm.id) {
      toast.error("User ID is missing");
      return;
    }
    const payloadUpdateProfile = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
    };
    dispatch(updateProfile({ id: editForm.id, data: payloadUpdateProfile }))
      .unwrap()
      .then((updatedUser) => {
        dispatch(setUser(updatedUser));
        toast.success("Profile updated successfully");
        setIsEditing(false);
      })
      .catch((err) => {
        toast.error(err || "Update failed");
      });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Ticket className="h-4 w-4 text-green-600" />;
      case "review":
        return <Star className="h-4 w-4 text-yellow-600" />;
      case "cancellation":
        return <Clock className="h-4 w-4 text-red-600" />;
      default:
        return <Film className="h-4 w-4 text-blue-600" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "booking":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Booking
          </Badge>
        );
      case "review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Review
          </Badge>
        );
      case "cancellation":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">Activity</Badge>;
    }
  };

  const totalBookings = user?.bookings.length || 0;

  const totalSpent =
    user?.bookings
      .filter((b) => b.status === "BOOKED")
      .reduce((sum, b) => sum + b.totalPrice, 0) || 0;

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">
                    {isEditing ? editForm.name : user?.name}
                  </h3>
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{totalBookings}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Bookings
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">${totalSpent}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>
                  Complete history of your account activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      <div className="mt-1">{getActivityIcon("booking")}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {booking.showtime.movie.title}
                          </h4>
                          {getActivityBadge("booking")}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {booking.status === "BOOKED"
                            ? "Đặt vé thành công"
                            : "Đang chờ thanh toán"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(booking.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        +${booking.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Movies</CardTitle>
                <CardDescription>
                  Movies you've loved and rated highly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {user?.bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="space-y-3">
                      <div className="relative">
                        <img
                          src={bookmark?.movie.image}
                          alt={bookmark?.movie.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            <Star className="h-3 w-3 mr-1" />
                            4.5
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          {bookmark.movie.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {bookmark.movie.genre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Đã thêm:{" "}
                          {new Date(bookmark.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
