import React, { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { createTheaterThunk } from "@/store/slices/theaterSlice";
import type { CreateTheaterRequest } from "@/services/type";
import type { AppDispatch } from "@/store";

interface CreateTheaterFormProps {
  onSuccess?: () => void;
}

export function CreateTheaterForm({ onSuccess }: CreateTheaterFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTheaterRequest>({
    name: "",
    location: "",
    brand: "",
    brandLogo: "",
    status: "active",
  });

  const handleInputChange = (
    field: keyof CreateTheaterRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên rạp chiếu");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Vui lòng nhập địa chỉ rạp chiếu");
      return;
    }
    if (!formData.brand.trim()) {
      toast.error("Vui lòng nhập thương hiệu");
      return;
    }
    if (!formData.status) {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }
    setLoading(true);
    try {
      await dispatch(createTheaterThunk(formData)).unwrap();
      toast.success("Tạo rạp chiếu mới thành công");
      setFormData({ name: "", location: "", brand: "", brandLogo: "", status: "active" });
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi tạo rạp chiếu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm rạp chiếu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm rạp chiếu mới</DialogTitle>
          <DialogDescription>
            Điền thông tin rạp chiếu mới vào form bên dưới
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Tên rạp chiếu *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nhập tên rạp chiếu"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="location">Địa chỉ *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Nhập địa chỉ rạp chiếu"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="brand">Thương hiệu *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="Nhập thương hiệu"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="brandLogo">Logo thương hiệu (URL)</Label>
              <Input
                id="brandLogo"
                value={formData.brandLogo}
                onChange={(e) => handleInputChange("brandLogo", e.target.value)}
                placeholder="Nhập URL logo (tùy chọn)"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="status">Trạng thái *</Label>
              <select
                id="status"
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
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Thêm rạp chiếu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 