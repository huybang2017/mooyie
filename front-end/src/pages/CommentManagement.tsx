import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminCommentsThunk,
  deleteCommentThunk,
} from "@/store/slices/commentSlice";
import { ActionConfirmationDialog } from "@/components/ActionConfirmationDialog";

const ratingOptions = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
];

const itemsPerPage = 7;

export default function CommentManagement() {
  const dispatch = useAppDispatch();
  const { commentsAdmin, loading, error } = useAppSelector(
    (state) => state.comment
  );
  const [movieSearch, setMovieSearch] = useState("");
  const [debouncedMovieSearch] = useDebounce(movieSearch, 500);
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch] = useDebounce(userSearch, 500);
  const [selectedRating, setSelectedRating] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    commentId: string | null;
    commentContent: string;
  }>({ open: false, commentId: null, commentContent: "" });

  // Gọi API mỗi khi filter/pagination thay đổi
  useEffect(() => {
    dispatch(
      fetchAdminCommentsThunk({
        page: currentPage,
        limit: itemsPerPage,
        movie: debouncedMovieSearch ? debouncedMovieSearch : undefined,
        user: debouncedUserSearch ? debouncedUserSearch : undefined,
        rating: selectedRating !== "all" ? Number(selectedRating) : undefined,
      })
    );
  }, [
    dispatch,
    currentPage,
    debouncedMovieSearch,
    debouncedUserSearch,
    selectedRating,
  ]);

  const comments = commentsAdmin?.data || [];
  const totalItems = commentsAdmin?.total || 0;
  const totalPages = commentsAdmin?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleMovieSearchChange = (value: string) => {
    setMovieSearch(value);
    setCurrentPage(1);
  };
  const handleUserSearchChange = (value: string) => {
    setUserSearch(value);
    setCurrentPage(1);
  };
  const handleRatingChange = (value: string) => {
    setSelectedRating(value);
    setCurrentPage(1);
  };
  const handleClearFilters = () => {
    setMovieSearch("");
    setUserSearch("");
    setSelectedRating("all");
    setCurrentPage(1);
  };

  const handleDeleteComment = async (id: string) => {
    setDeletingId(id);
    try {
      await dispatch(deleteCommentThunk(id)).unwrap();
      toast.success("Comment deleted successfully");
    } catch (e) {
      toast.error("Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRequestDeleteComment = (id: string, content: string) => {
    setConfirmDialog({ open: true, commentId: id, commentContent: content });
  };
  const handleConfirmDeleteComment = async () => {
    if (!confirmDialog.commentId) return;
    await handleDeleteComment(confirmDialog.commentId);
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  // Render UI với điều kiện loading/error/commentsAdmin
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comment Management</h1>
          <p className="text-muted-foreground">
            Manage user comments about movies
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleClearFilters}>
            Refresh
          </Button>
        </div>
      </div>
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* User search filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-user">User</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter-user"
                  placeholder="Search by user name..."
                  value={userSearch}
                  onChange={(e) => handleUserSearchChange(e.target.value)}
                  className="pl-10"
                />
                {userSearch !== debouncedUserSearch && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>
            {/* Movie search filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-movie">Movie</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter-movie"
                  placeholder="Search by movie title..."
                  value={movieSearch}
                  onChange={(e) => handleMovieSearchChange(e.target.value)}
                  className="pl-10"
                />
                {movieSearch !== debouncedMovieSearch && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
                  </div>
                )}
              </div>
            </div>
            {/* Rating filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-rating">Rating</Label>
              <Select value={selectedRating} onValueChange={handleRatingChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Clear filters button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comment List</CardTitle>
          <CardDescription>
            Displaying {comments.length} out of {totalItems} comments
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 dark:border-green-400"></div>
                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  Loading...
                </span>
              </div>
            </div>
          )}
          {!loading && error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}
          {!loading && !error && commentsAdmin && comments.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No comments found.
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Movie</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={6}>
                        <div className="flex items-center space-x-4 p-4">
                          <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-10 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {comment.user && comment.user.avatar ? (
                            <img
                              src={comment.user.avatar}
                              alt={comment.user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
                              {comment.user ? comment.user.name.charAt(0) : "?"}
                            </div>
                          )}
                          <span>{comment.user ? comment.user.name : "?"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {comment.movie ? comment.movie.title : "?"}
                      </TableCell>
                      <TableCell>{comment.content}</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {comment.rating}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(comment.createdAt).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <button
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          disabled={deletingId === comment.id || loading}
                          onClick={() =>
                            handleRequestDeleteComment(
                              comment.id,
                              comment.content
                            )
                          }
                          title="Delete comment"
                        >
                          {deletingId === comment.id ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></span>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Displaying {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} out of{" "}
              {totalItems} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ActionConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title="Delete Comment?"
        description={`Are you sure you want to delete the comment: "${confirmDialog.commentContent.slice(
          0,
          40
        )}${confirmDialog.commentContent.length > 40 ? "..." : ""}"`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={<Trash2 className="w-5 h-5" />}
        onConfirm={handleConfirmDeleteComment}
        loading={deletingId === confirmDialog.commentId}
      />
    </div>
  );
}
