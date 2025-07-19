import React, { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { updateMovieThunk } from "@/store/slices/movieSlice";
import type { UpdateMovieRequest, Movie } from "@/services/type";
import { useAppDispatch } from "@/store/hooks";

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

interface UpdateMovieFormProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateMovieForm({ 
  movie, 
  open, 
  onOpenChange, 
  onSuccess 
}: UpdateMovieFormProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateMovieRequest>({
    title: "",
    genre: "",
    duration: 0,
    description: "",
    image: "",
    trailer_url: "",
    status: "coming_soon",
  });

  // Initialize form data when movie changes
  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        genre: movie.genre || "",
        duration: movie.duration || 0,
        description: movie.description || "",
        image: movie.image || "",
        trailer_url: movie.trailer_url || "",
        status: movie.status || "coming_soon",
      });
    }
  }, [movie]);

  const handleInputChange = (
    field: keyof UpdateMovieRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!movie) {
      toast.error("Movie information not found");
      return;
    }

    // Validation
    if (!formData.title?.trim()) {
      toast.error("Please enter the movie title");
      return;
    }

    if (!formData.genre?.trim()) {
      toast.error("Please select the movie genre");
      return;
    }

    if (!formData.duration || formData.duration <= 0) {
      toast.error("Movie duration must be greater than 0");
      return;
    }

    if (!formData.description?.trim()) {
      toast.error("Please enter the movie description");
      return;
    }

    if (!formData.image?.trim()) {
      toast.error("Please enter the movie image URL");
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateMovieThunk({ id: movie.id, data: formData })).unwrap();
      toast.success("Movie updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "An error occurred while updating the movie");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!movie) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật phim</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin phim: {movie.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tên phim *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Nhập tên phim"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Thể loại *</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => handleInputChange("genre", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thể loại phim" />
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
              <Label htmlFor="duration">Thời lượng (phút) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="500"
                value={formData.duration || ""}
                onChange={(e) =>
                  handleInputChange("duration", parseInt(e.target.value) || 0)
                }
                placeholder="Nhập thời lượng phim"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coming_soon">Sắp chiếu</SelectItem>
                  <SelectItem value="now_showing">Đang chiếu</SelectItem>
                  <SelectItem value="ended">Đã kết thúc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL ảnh phim *</Label>
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
            <Label htmlFor="trailer_url">URL trailer (tùy chọn)</Label>
            <Input
              id="trailer_url"
              type="url"
              value={formData.trailer_url}
              onChange={(e) => handleInputChange("trailer_url", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả phim *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Nhập mô tả chi tiết về phim"
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Cập nhật phim
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 