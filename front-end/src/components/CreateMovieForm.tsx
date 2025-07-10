import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
import type { AppDispatch } from "@/store";

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
  const dispatch = useDispatch<AppDispatch>();
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
      toast.error("Vui lòng nhập tên phim");
      return;
    }

    if (!formData.genre.trim()) {
      toast.error("Vui lòng nhập thể loại phim");
      return;
    }

    if (formData.duration <= 0) {
      toast.error("Thời lượng phim phải lớn hơn 0");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả phim");
      return;
    }

    if (!formData.image.trim()) {
      toast.error("Vui lòng nhập URL ảnh phim");
      return;
    }

    setLoading(true);
    try {
      await dispatch(createMovieThunk(formData)).unwrap();
      toast.success("Tạo phim mới thành công");
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
      toast.error(error || "Có lỗi xảy ra khi tạo phim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm phim mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm phim mới</DialogTitle>
          <DialogDescription>
            Điền thông tin phim mới vào form bên dưới
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Tạo phim
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
 