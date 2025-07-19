import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Filter } from "lucide-react";
import type { Showtime } from "@/services/type";
import { ShowtimeActionMenu } from "@/components/ShowtimeActionMenu";
import { CreateShowtimeForm } from "@/components/CreateShowtimeForm";
import { UpdateShowtimeForm } from "@/components/UpdateShowtimeForm";
import {
  fetchAdminShowtimesThunk,
  deleteShowtimeThunk,
} from "@/store/slices/showtimeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDebounce } from "use-debounce";

export default function ShowtimeManagement() {
  const dispatch = useAppDispatch();
  const { adminShowtimes, loading, error } = useAppSelector(
    (state) => state.showtime
  );

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null
  );
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filterDateTime, setFilterDateTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [movieSearch, setMovieSearch] = useState("");
  const [debouncedMovieSearch] = useDebounce(movieSearch, 500);

  useEffect(() => {
    dispatch(
      fetchAdminShowtimesThunk({
        page: currentPage,
        limit: itemsPerPage,
        movie: debouncedMovieSearch || undefined,
        time: filterDateTime || undefined,
        isActive:
          selectedStatus === "all"
            ? undefined
            : selectedStatus === "active"
            ? true
            : false,
      })
    );
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    debouncedMovieSearch,
    selectedStatus,
    filterDateTime,
  ]);

  const handleRefresh = () => {
    dispatch(
      fetchAdminShowtimesThunk({
        page: currentPage,
        limit: itemsPerPage,
        movie: debouncedMovieSearch || undefined,
        time: filterDateTime || undefined,
        isActive:
          selectedStatus === "all"
            ? undefined
            : selectedStatus === "active"
            ? true
            : false,
      })
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleMovieSearchChange = (value: string) => {
    setMovieSearch(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };
  const handleDateTimeChange = (value: string) => {
    setFilterDateTime(value);
    setCurrentPage(1);
  };
  const handleClearFilters = () => {
    setMovieSearch("");
    setSelectedStatus("all");
    setFilterDateTime("");
    setCurrentPage(1);
  };

  // Handler functions for ShowtimeActionMenu
  const handleViewShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setIsDetailDialogOpen(true);
  };

  const handleEditShowtime = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteShowtime = async (showtime: Showtime) => {
    try {
      await dispatch(deleteShowtimeThunk(showtime.id)).unwrap();
      toast.success("Showtime deleted successfully");
      handleRefresh();
    } catch (error: any) {
      toast.error(error || "Error deleting showtime");
    }
  };

  const handleCreateSuccess = () => {
    toast.success("Showtime created successfully");
    handleRefresh();
  };

  const handleUpdateSuccess = () => {
    toast.success("Showtime updated successfully");
    setIsUpdateDialogOpen(false);
    setEditingShowtime(null);
    handleRefresh();
  };

  // Remove FE filtering, just use adminShowtimes?.data
  const showtimes = adminShowtimes?.data || [];
  const totalPages = adminShowtimes?.totalPages || 1;
  const totalItems = adminShowtimes?.total || 0;

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100">
        Inactive
      </Badge>
    );
  };

  if (loading && !adminShowtimes) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Showtime Management</h1>
          <p className="text-muted-foreground">
            Manage showtimes and screening information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
          <CreateShowtimeForm onSuccess={handleCreateSuccess} />
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Movie name search filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-movie">Movie</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter-movie"
                  placeholder="Search by movie name..."
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
            {/* Status filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Time filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-datetime">Showtime Date & Time</Label>
              <Input
                id="filter-datetime"
                type="datetime-local"
                value={filterDateTime}
                onChange={(e) => handleDateTimeChange(e.target.value)}
              />
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
          <CardTitle>Showtime List</CardTitle>
          <CardDescription>
            Displaying {showtimes.length} out of {totalItems} showtimes
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Movie</TableHead>
                <TableHead>Theater & Room</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={6}>
                        <div className="flex items-center space-x-4 p-4">
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                          <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : showtimes.map((showtime: Showtime) => (
                    <TableRow key={showtime.id}>
                      <TableCell>
                        <div className="font-medium">
                          {showtime.movie?.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {showtime.room?.theater?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {showtime.room?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {showtime.time &&
                              showtime.time[0] &&
                              new Date(showtime.time[0].start).toLocaleString(
                                "en-US"
                              )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {showtime.time &&
                              showtime.time[0] &&
                              new Date(showtime.time[0].end).toLocaleString(
                                "en-US"
                              )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{showtime.room?.seatCount || 0} seats</div>
                          <div className="text-muted-foreground">
                            {showtime.room?.seats?.length || 0} available seats
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(showtime.isActive)}</TableCell>
                      <TableCell>
                        <ShowtimeActionMenu
                          showtime={showtime}
                          onView={handleViewShowtime}
                          onEdit={handleEditShowtime}
                          onDelete={handleDeleteShowtime}
                        />
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

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="min-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Showtime Details</DialogTitle>
            <DialogDescription>
              Detailed information about the showtime and ticket prices per seat
            </DialogDescription>
          </DialogHeader>
          {selectedShowtime && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Movie Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Movie Name:</span>
                      <span>{selectedShowtime.movie?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Genre:</span>
                      <span>{selectedShowtime.movie?.genre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{selectedShowtime.movie?.duration} minutes</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    Theater Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Theater:</span>
                      <span>{selectedShowtime.room?.theater?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Room:</span>
                      <span>{selectedShowtime.room?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Address:</span>
                      <span className="text-right max-w-xs">
                        {selectedShowtime.room?.theater?.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Showtime Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Showtime Details
                </h3>
                <div className="space-y-2 text-sm">
                  {selectedShowtime.time &&
                    selectedShowtime.time.map(
                      (
                        timeSlot: { start: string; end: string },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">Start:</span>
                            <span>
                              {new Date(timeSlot.start).toLocaleString("en-US")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">End:</span>
                            <span>
                              {new Date(timeSlot.end).toLocaleString("en-US")}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>

              {/* Seat list and ticket price */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Seat List & Ticket Price
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-96 overflow-y-auto">
                  {selectedShowtime.room?.seats?.map((seat: any) => (
                    <div
                      key={seat.id}
                      className="border rounded-lg p-2 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <div className="text-center space-y-1">
                        <div className="font-medium text-xs">
                          Seat {seat.row}
                          {seat.number}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {seat.type === "REGULAR" ? "Regular" : "VIP"}
                        </div>
                        <div className="font-semibold text-green-600 text-xs">
                          {seat.price.toLocaleString()} VND
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground pt-2 border-t">
                  Total: {selectedShowtime.room?.seats?.length || 0} seats
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Showtime Form */}
      <UpdateShowtimeForm
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        showtime={editingShowtime}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
