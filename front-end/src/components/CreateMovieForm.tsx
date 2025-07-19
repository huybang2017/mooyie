import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { createMovieThunk } from "@/store/slices/movieSlice";
import type { CreateMovieRequest } from "@/services/type";
import { useAppDispatch } from "@/store/hooks";

interface CreateMovieFormProps {
  onSuccess?: () => void;
}

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Documentary",
];

export function CreateMovieForm({ onSuccess }: CreateMovieFormProps) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMovieRequest>({
    title: "",
    genre: "",
    duration: 0,
    description: "",
    image: "",
    trailer_url: "",
    status: "coming_soon",
  });

  const handleInputChange = (
    field: keyof CreateMovieRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter the movie title");
      return;
    }

    if (!formData.genre.trim()) {
      toast.error("Please enter the movie genre");
      return;
    }

    if (formData.duration <= 0) {
      toast.error("Movie duration must be greater than 0");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter the movie description");
      return;
    }

    if (!formData.image.trim()) {
      toast.error("Please enter the movie image URL");
      return;
    }

    setLoading(true);
    try {
      await dispatch(createMovieThunk(formData)).unwrap();
      toast.success("Movie created successfully");
      setFormData({
        title: "",
        genre: "",
        duration: 0,
        description: "",
        image: "",
        trailer_url: "",
        status: "coming_soon",
      });
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "An error occurred while creating the movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add new movie
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add new movie</DialogTitle>
          <DialogDescription>
            Fill in the movie details in the form below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Movie Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter movie title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => handleInputChange("genre", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select movie genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="500"
                value={formData.duration || ""}
                onChange={(e) =>
                  handleInputChange("duration", parseInt(e.target.value) || 0)
                }
                placeholder="Enter movie duration"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coming_soon">Coming Soon</SelectItem>
                  <SelectItem value="now_showing">Now Showing</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Movie Image URL *</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trailer_url">Trailer URL (optional)</Label>
            <Input
              id="trailer_url"
              type="url"
              value={formData.trailer_url}
              onChange={(e) => handleInputChange("trailer_url", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Movie Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter detailed movie description"
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Movie
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
 