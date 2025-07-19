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
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { updateShowtimeThunk } from "@/store/slices/showtimeSlice";
import type { UpdateShowtimeRequest, Showtime } from "@/services/type";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminMoviesThunk } from "@/store/slices/movieSlice";
import { fetchTheatersAdminThunk } from "@/store/slices/theaterSlice";
import { fetchRoomsByTheaterThunk } from "@/store/slices/roomSlice";

interface UpdateShowtimeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showtime: Showtime | null;
  onSuccess?: () => void;
}

export function UpdateShowtimeForm({
  open,
  onOpenChange,
  showtime,
  onSuccess,
}: UpdateShowtimeFormProps) {
  const dispatch = useAppDispatch();
  const { adminMovies } = useAppSelector((state) => state.movie);
  const { adminTheaters } = useAppSelector((state) => state.theater);
  const { rooms } = useAppSelector((state) => state.room);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    Omit<UpdateShowtimeRequest, "time"> & {
      startTimes: string[];
      theaterId: string;
      isActive?: boolean;
    }
  >({
    movieId: "",
    theaterId: "",
    roomId: "",
    startTimes: [""],
    isActive: true,
  });

  // Fetch movies and theaters on mount
  useEffect(() => {
    dispatch(fetchAdminMoviesThunk({}));
    dispatch(fetchTheatersAdminThunk({}));
  }, [dispatch]);

  // Set form data and fetch rooms when showtime changes
  useEffect(() => {
    if (showtime) {
      const theaterId = showtime.room?.theaterId || "";
      const startTimes = Array.isArray(showtime.time)
        ? showtime.time.map((t) =>
            t.start ? new Date(t.start).toISOString().slice(0, 16) : ""
          )
        : [""];
      setFormData({
        movieId: showtime.movieId || "",
        roomId: showtime.roomId || "",
        theaterId,
        startTimes: startTimes.length ? startTimes : [""],
        isActive: showtime.isActive ?? true,
      });
      if (theaterId) {
        dispatch(fetchRoomsByTheaterThunk(theaterId));
      }
    }
  }, [showtime, dispatch]);

  // When rooms are loaded after showtime is set, ensure roomId is set if available
  useEffect(() => {
    if (showtime && formData.theaterId && rooms.length > 0) {
      const found = rooms.find((room) => room.id === showtime.roomId);
      if (found) {
        setFormData((prev) => ({ ...prev, roomId: showtime.roomId }));
      } else {
        setFormData((prev) => ({ ...prev, roomId: "" }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms, showtime, formData.theaterId]);

  // Only reset roomId if user actually changes theater
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => {
      if (field === "theaterId") {
        return { ...prev, theaterId: value, roomId: "" };
      }
      return { ...prev, [field]: value };
    });
  };

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
      return {
        ...prev,
        startTimes: newStartTimes.length ? newStartTimes : [""],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showtime) {
      toast.error("Showtime not found");
      return;
    }
    if (!(formData.movieId ?? "").trim()) {
      toast.error("Please select a movie");
      return;
    }
    if (!(formData.theaterId ?? "").trim()) {
      toast.error("Please select a theater");
      return;
    }
    if (!(formData.roomId ?? "").trim()) {
      toast.error("Please select a room");
      return;
    }
    if (
      !formData.startTimes.length ||
      formData.startTimes.some((t) => !t.trim())
    ) {
      toast.error("Please enter at least one valid showtime");
      return;
    }
    // Send startTimes array and isActive to backend
    const updateShowtimeData = {
      movieId: formData.movieId || "",
      roomId: formData.roomId || "",
      startTimes: formData.startTimes,
      isActive: formData.isActive,
    };
    setLoading(true);
    try {
      await dispatch(
        updateShowtimeThunk({ id: showtime.id, data: updateShowtimeData })
      ).unwrap();
      toast.success("Showtime updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "An error occurred while updating the showtime");
    } finally {
      setLoading(false);
    }
  };

  if (!showtime) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật lịch chiếu</DialogTitle>
          <DialogDescription>Cập nhật thông tin lịch chiếu</DialogDescription>
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
              <Label htmlFor="isActive">Trạng thái lịch chiếu</Label>
              <Select
                value={formData.isActive ? "true" : "false"}
                onValueChange={(value) =>
                  handleInputChange("isActive", value === "true")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Đang chiếu</SelectItem>
                  <SelectItem value="false">Đã hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          <div className="space-y-2">
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật lịch chiếu"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
