import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trash2, Edit, Eye, RefreshCw } from "lucide-react";
import type { Movie } from "@/services/type";

interface BulkActionConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "delete" | "update" | "export";
  selectedMovies: Movie[];
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function BulkActionConfirmation({
  open,
  onOpenChange,
  action,
  selectedMovies,
  onConfirm,
  onCancel,
  loading = false,
}: BulkActionConfirmationProps) {
  const getActionConfig = () => {
    switch (action) {
      case "delete":
        return {
          title: "Xóa nhiều phim",
          description: `Bạn có chắc chắn muốn xóa ${selectedMovies.length} phim đã chọn? Hành động này không thể hoàn tác.`,
          confirmText: "Xóa tất cả",
          variant: "destructive" as const,
          icon: <Trash2 className="h-5 w-5" />,
        };
      case "update":
        return {
          title: "Cập nhật hàng loạt",
          description: `Bạn sắp cập nhật ${selectedMovies.length} phim. Hãy xác nhận để tiếp tục.`,
          confirmText: "Cập nhật tất cả",
          variant: "warning" as const,
          icon: <Edit className="h-5 w-5" />,
        };
      case "export":
        return {
          title: "Xuất dữ liệu",
          description: `Xuất thông tin của ${selectedMovies.length} phim đã chọn.`,
          confirmText: "Xuất dữ liệu",
          variant: "default" as const,
          icon: <Eye className="h-5 w-5" />,
        };
    }
  };

  const config = getActionConfig();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className={`text-${config.variant === "destructive" ? "red" : config.variant === "warning" ? "yellow" : "blue"}-600`}>
              {config.icon}
            </div>
            <DialogTitle className="text-lg font-semibold">
              {config.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-neutral-600 dark:text-neutral-400">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {/* Selected Movies Preview */}
        <div className="max-h-32 overflow-y-auto space-y-2">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Phim đã chọn:
          </p>
          <div className="flex flex-wrap gap-1">
            {selectedMovies.slice(0, 5).map((movie) => (
              <Badge key={movie.id} variant="secondary" className="text-xs">
                {movie.title}
              </Badge>
            ))}
            {selectedMovies.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{selectedMovies.length - 5} phim khác
              </Badge>
            )}
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 ${
              config.variant === "destructive"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : config.variant === "warning"
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 