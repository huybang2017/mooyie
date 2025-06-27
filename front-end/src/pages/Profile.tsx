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
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Star,
  Clock,
  Film,
  Ticket,
  LogOut,
  Save,
} from "lucide-react";

// Fake user data
const fakeUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  location: "New York, NY",
  joinDate: "2023-03-15",
  membership: "Premium",
  totalBookings: 24,
  totalSpent: 342.5,
  favoriteGenres: ["Action", "Sci-Fi", "Drama"],
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      profileVisible: true,
      showBookings: false,
      allowMarketing: true,
    },
  },
};

const fakeRecentActivity = [
  {
    id: "1",
    type: "booking",
    title: "Booked tickets for Inception",
    description: "2 tickets for Saturday, 8:30 PM",
    date: "2024-01-15",
    time: "2 hours ago",
    amount: 24.0,
  },
  {
    id: "2",
    type: "review",
    title: "Rated The Matrix",
    description: "Gave 5 stars and left a review",
    date: "2024-01-12",
    time: "3 days ago",
    rating: 5,
  },
  {
    id: "3",
    type: "booking",
    title: "Booked tickets for Interstellar",
    description: "3 tickets for Sunday, 7:00 PM",
    date: "2024-01-10",
    time: "5 days ago",
    amount: 36.0,
  },
  {
    id: "4",
    type: "cancellation",
    title: "Cancelled Avatar booking",
    description: "Refunded $12.00 to your account",
    date: "2024-01-08",
    time: "1 week ago",
    amount: -12.0,
  },
];

const fakeFavoriteMovies = [
  {
    id: "1",
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    rating: 5,
    watchedCount: 3,
    lastWatched: "2024-01-15",
  },
  {
    id: "2",
    title: "The Matrix",
    poster: "https://image.tmdb.org/t/p/w500/aZiK13I8vIcb6xaUufIjQIGfAzx.jpg",
    rating: 5,
    watchedCount: 2,
    lastWatched: "2024-01-12",
  },
  {
    id: "3",
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    rating: 4,
    watchedCount: 1,
    lastWatched: "2024-01-10",
  },
  {
    id: "4",
    title: "Avatar",
    poster: "https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg",
    rating: 4,
    watchedCount: 1,
    lastWatched: "2024-01-05",
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
            {isEditing && (
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Profile Overview */}
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
                    <AvatarImage src={fakeUser.avatar} alt={fakeUser.name} />
                    <AvatarFallback className="text-lg">
                      {fakeUser.name
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
                  <h3 className="font-semibold">{fakeUser.name}</h3>
                  <Badge variant="secondary">{fakeUser.membership}</Badge>
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {fakeUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {fakeUser.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {fakeUser.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(fakeUser.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <Separator />
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {fakeUser.totalBookings}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Bookings
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">${fakeUser.totalSpent}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {fakeUser.favoriteGenres.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Favorite Genres
                    </p>
                  </div>
                </div>

                {/* Favorite Genres */}
                <div>
                  <p className="text-sm font-medium mb-2">Favorite Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {fakeUser.favoriteGenres.map((genre) => (
                      <Badge key={genre} variant="outline">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest actions and bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fakeRecentActivity.slice(0, 3).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                        {activity.amount && (
                          <span
                            className={`text-sm font-medium ${
                              activity.amount > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {activity.amount > 0 ? "+" : ""}$
                            {Math.abs(activity.amount)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>
                    Your movie watching statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Movies Watched
                      </span>
                      <span className="text-sm text-muted-foreground">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Average Rating
                      </span>
                      <span className="text-sm text-muted-foreground">
                        4.2/5
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Reviews Written
                      </span>
                      <span className="text-sm text-muted-foreground">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Rewards Points
                      </span>
                      <span className="text-sm text-muted-foreground">
                        1,250
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
                  {fakeRecentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          {getActivityBadge(activity.type)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {activity.time}
                        </p>
                      </div>
                      {activity.amount && (
                        <span
                          className={`text-sm font-medium ${
                            activity.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {activity.amount > 0 ? "+" : ""}$
                          {Math.abs(activity.amount)}
                        </span>
                      )}
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
                  {fakeFavoriteMovies.map((movie) => (
                    <div key={movie.id} className="space-y-3">
                      <div className="relative">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            <Star className="h-3 w-3 mr-1" />
                            {movie.rating}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{movie.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Watched {movie.watchedCount} times
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last:{" "}
                          {new Date(movie.lastWatched).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Button
                      variant={
                        fakeUser.preferences.notifications.email
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {fakeUser.preferences.notifications.email ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via SMS
                      </p>
                    </div>
                    <Button
                      variant={
                        fakeUser.preferences.notifications.sms
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {fakeUser.preferences.notifications.sms ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates in app
                      </p>
                    </div>
                    <Button
                      variant={
                        fakeUser.preferences.notifications.push
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {fakeUser.preferences.notifications.push ? "On" : "Off"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy</span>
                  </CardTitle>
                  <CardDescription>
                    Control your privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Public Profile</p>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your profile
                      </p>
                    </div>
                    <Button
                      variant={
                        fakeUser.preferences.privacy.profileVisible
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {fakeUser.preferences.privacy.profileVisible
                        ? "Public"
                        : "Private"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Show Bookings</p>
                      <p className="text-sm text-muted-foreground">
                        Display your booking history
                      </p>
                    </div>
                    <Button
                      variant={
                        fakeUser.preferences.privacy.showBookings
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {fakeUser.preferences.privacy.showBookings
                        ? "Show"
                        : "Hide"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional content
                      </p>
                    </div>
                    <Button
                      variant={
                        fakeUser.preferences.privacy.allowMarketing
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {fakeUser.preferences.privacy.allowMarketing
                        ? "Allow"
                        : "Block"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account and data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </Button>
                  <Button variant="destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
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
