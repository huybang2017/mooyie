import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { updateBookingThunk } from "@/store/slices/bookingSlice";
import { BookingStatus, type Booking } from "@/services/type";
import { useState, useEffect } from "react";

interface UpdateBookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onSuccess?: () => void;
}

const statuses = [
  { label: "Đang chờ", value: BookingStatus.PENDING },
  { label: "Đã xác nhận", value: BookingStatus.CONFIRMED },
  { label: "Đã hủy", value: BookingStatus.CANCELED },
  { label: "Đã sử dụng", value: BookingStatus.USED },
  { label: "Hết hạn", value: BookingStatus.EXPIRED },
];

export function UpdateBookingForm({
  open,
  onOpenChange,
  booking,
  onSuccess,
}: UpdateBookingFormProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.booking);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (booking) {
      setStatus(booking.status);
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    if (!status) {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }
    try {
      await dispatch(
        updateBookingThunk({ id: booking.id, status: status as BookingStatus })
      ).unwrap();
      toast.success("Cập nhật trạng thái thành công");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đặt vé</DialogTitle>
          <DialogDescription>
            Chỉ cho phép cập nhật trạng thái đặt vé.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              Lưu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
