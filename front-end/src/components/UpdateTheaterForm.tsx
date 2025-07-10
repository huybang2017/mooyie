import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { updateTheaterThunk } from "@/store/slices/theaterSlice";
import type { UpdateTheaterRequest, Theater } from "@/services/type";
import type { AppDispatch } from "@/store";

interface UpdateTheaterFormProps {
  theater: Theater | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateTheaterForm({
  theater,
  open,
  onOpenChange,
  onSuccess,
}: UpdateTheaterFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateTheaterRequest>({
    name: "",
    location: "",
    brand: "",
    brandLogo: "",
    status: "active",
  });

  useEffect(() => {
    if (theater) {
      setFormData({
        name: theater.name || "",
        location: theater.location || "",
        brand: theater.brand || "",
        brandLogo: theater.brandLogo || "",
        status: theater.status || "active",
      });
    }
  }, [theater]);

  const handleInputChange = (
    field: keyof UpdateTheaterRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theater) {
      toast.error("Không tìm thấy thông tin rạp chiếu");
      return;
    }
    if (!formData.name?.trim()) {
      toast.error("Vui lòng nhập tên rạp chiếu");
      return;
    }
    if (!formData.location?.trim()) {
      toast.error("Vui lòng nhập địa chỉ rạp chiếu");
      return;
    }
    if (!formData.brand?.trim()) {
      toast.error("Vui lòng nhập thương hiệu");
      return;
    }
    if (!formData.status) {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }
    setLoading(true);
    try {
      await dispatch(updateTheaterThunk({ id: theater.id, data: formData })).unwrap();
      toast.success("Cập nhật rạp chiếu thành công");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi cập nhật rạp chiếu");
    } finally {
      setLoading(false);
    }
  };

  if (!theater) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật rạp chiếu</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin rạp chiếu: {theater.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-name">Tên rạp chiếu *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập tên rạp chiếu"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-location">Địa chỉ *</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Nhập địa chỉ rạp chiếu"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-brand">Thương hiệu *</Label>
              <Input
                id="edit-brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="Nhập thương hiệu"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-brandLogo">Logo thương hiệu (URL)</Label>
              <Input
                id="edit-brandLogo"
                value={formData.brandLogo}
                onChange={(e) => handleInputChange("brandLogo", e.target.value)}
                placeholder="Nhập URL logo (tùy chọn)"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-status">Trạng thái *</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 