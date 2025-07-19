import React, { useState } from "react";
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
import { useAppDispatch } from "@/store/hooks";

interface CreateTheaterFormProps {
  onSuccess?: () => void;
}

export function CreateTheaterForm({ onSuccess }: CreateTheaterFormProps) {
  const dispatch = useAppDispatch();
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
      toast.error("Please enter the theater name");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Please enter the theater address");
      return;
    }
    if (!formData.brand.trim()) {
      toast.error("Please enter the brand");
      return;
    }
    if (!formData.status) {
      toast.error("Please select a status");
      return;
    }
    setLoading(true);
    try {
      await dispatch(createTheaterThunk(formData)).unwrap();
      toast.success("Theater created successfully");
      setFormData({ name: "", location: "", brand: "", brandLogo: "", status: "active" });
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error || "An error occurred while creating the theater");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add theater
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add new theater</DialogTitle>
          <DialogDescription>
            Fill in the theater information in the form below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Theater name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter theater name"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="location">Address *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter theater address"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="Enter brand"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="brandLogo">Brand logo (URL)</Label>
              <Input
                id="brandLogo"
                value={formData.brandLogo}
                onChange={(e) => handleInputChange("brandLogo", e.target.value)}
                placeholder="Enter brand logo URL (optional)"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Add theater
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 