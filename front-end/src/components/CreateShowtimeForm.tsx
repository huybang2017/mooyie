import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createShowtimeThunk } from "@/store/slices/showtimeSlice";
import type {
  CreateShowtimeRequest
} from "@/services/type";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminMoviesThunk } from "@/store/slices/movieSlice";
import { fetchTheatersAdminThunk } from "@/store/slices/theaterSlice";
import { fetchRoomsByTheaterThunk } from "@/store/slices/roomSlice";

interface CreateShowtimeFormProps {
  onSuccess?: () => void;
}

export function CreateShowtimeForm({ onSuccess }: CreateShowtimeFormProps) {
  const dispatch = useAppDispatch();
  const { adminMovies } = useAppSelector((state) => state.movie);
  const { adminTheaters } = useAppSelector((state) => state.theater);
  const { rooms } = useAppSelector((state) => state.room);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    Omit<CreateShowtimeRequest, "time"> & { startTimes: string[]; theaterId: string }
  >({
    movieId: "",
    theaterId: "",
    roomId: "",
    startTimes: [""]
  });

  useEffect(() => {
    dispatch(fetchAdminMoviesThunk({}));
    dispatch(fetchTheatersAdminThunk({}));
  }, [dispatch]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // When theater changes, fetch rooms and reset roomId
  useEffect(() => {
    if (formData.theaterId) {
      dispatch(fetchRoomsByTheaterThunk(formData.theaterId));
      setFormData((prev) => ({ ...prev, roomId: "" }));
    }
  }, [formData.theaterId, dispatch]);

  // Handle change for a specific start time
  const handleStartTimeChange = (idx: number, value: string) => {
    setFormData((prev) => {
      const newStartTimes = [...prev.startTimes];
      newStartTimes[idx] = value;
      return { ...prev, startTimes: newStartTimes };
    });
  };

  // Add a new start time input
  const handleAddStartTime = () => {
    setFormData((prev) => ({ ...prev, startTimes: [...prev.startTimes, ""] }));
  };

  // Remove a start time input
  const handleRemoveStartTime = (idx: number) => {
    setFormData((prev) => {
      const newStartTimes = prev.startTimes.filter((_, i) => i !== idx);
      return { ...prev, startTimes: newStartTimes.length ? newStartTimes : [""] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.movieId.trim()) {
      toast.error("Vui lòng chọn phim");
      return;
    }
    if (!formData.theaterId.trim()) {
      toast.error("Vui lòng chọn rạp chiếu");
      return;
    }
    if (!formData.roomId.trim()) {
      toast.error("Vui lòng chọn phòng chiếu");
      return;
    }
    if (!formData.startTimes.length || formData.startTimes.some((t) => !t.trim())) {
      toast.error("Vui lòng nhập ít nhất một thời gian chiếu hợp lệ");
      return;
    }
    // Send startTimes array to backend
    const createShowtimeData = {
      movieId: formData.movieId,
      roomId: formData.roomId,
      startTimes: formData.startTimes,
    };
    setLoading(true);
    try {
      await dispatch(createShowtimeThunk(createShowtimeData)).unwrap();
      toast.success("Tạo lịch chiếu mới thành công");
      setFormData({
        movieId: "",
        theaterId: "",
        roomId: "",
        startTimes: [""]
      });
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi tạo lịch chiếu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm lịch chiếu mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm lịch chiếu mới</DialogTitle>
          <DialogDescription>
            Điền thông tin lịch chiếu mới vào form bên dưới
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="movieId">Phim *</Label>
              <Select
                value={formData.movieId}
                onValueChange={(value) => handleInputChange("movieId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phim" />
                </SelectTrigger>
                <SelectContent>
                  {adminMovies?.data?.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theaterId">Rạp chiếu *</Label>
              <Select
                value={formData.theaterId}
                onValueChange={(value) => handleInputChange("theaterId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn rạp" />
                </SelectTrigger>
                <SelectContent>
                  {adminTheaters?.data?.map((theater) => (
                    <SelectItem key={theater.id} value={theater.id}>
                      {theater.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomId">Phòng chiếu *</Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) => handleInputChange("roomId", value)}
                disabled={!formData.theaterId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng" />
                </SelectTrigger>
                <SelectContent>
                  {rooms?.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Thời gian chiếu *</Label>
              {formData.startTimes.map((startTime, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(idx, e.target.value)}
                    required
                  />
                  {formData.startTimes.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveStartTime(idx)}
                    >
                      -
                    </Button>
                  )}
                  {idx === formData.startTimes.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddStartTime}
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>
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
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo lịch chiếu"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
