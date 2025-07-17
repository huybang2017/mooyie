import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import type { Showtime } from "@/services/type";

interface ShowtimeActionMenuProps {
  showtime: Showtime;
  onView: (showtime: Showtime) => void;
  onEdit: (showtime: Showtime) => void;
  onDelete: (showtime: Showtime) => void;
}

export function ShowtimeActionMenu({
  showtime,
  onView,
  onEdit,
  onDelete,
}: ShowtimeActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Thao tác"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => {
            onView(showtime);
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <Eye className="h-4 w-4 mr-2" />
          Xem chi tiết
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            onEdit(showtime);
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            onDelete(showtime);
            setIsOpen(false);
          }}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa lịch chiếu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
