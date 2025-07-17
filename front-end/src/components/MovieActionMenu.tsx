import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
} from "lucide-react";
import type { Movie } from "@/services/type";

interface MovieActionMenuProps {
  movie: Movie;
  onView: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onCopyLink?: (movie: Movie) => void;
}

export function MovieActionMenu({
  movie,
  onView,
  onEdit,
  onDelete,
  onCopyLink,
}: MovieActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink(movie);
    } else {
      // Default copy behavior
      const url = `${window.location.origin}/movies/${movie.id}`;
      navigator.clipboard.writeText(url);
    }
  };

  const handleViewTrailer = () => {
    if (movie.trailer_url) {
      window.open(movie.trailer_url, "_blank");
    }
  };

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
            onView(movie);
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <Eye className="h-4 w-4 mr-2" />
          Xem chi tiết
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            onEdit(movie);
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <Edit className="h-4 w-4 mr-2" />
          Chỉnh sửa
        </DropdownMenuItem>

        {movie.trailer_url && (
          <DropdownMenuItem
            onClick={() => {
              handleViewTrailer();
              setIsOpen(false);
            }}
            className="cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Xem trailer
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            handleCopyLink();
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <Copy className="h-4 w-4 mr-2" />
          Sao chép link
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            onDelete(movie);
            setIsOpen(false);
          }}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa phim
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
