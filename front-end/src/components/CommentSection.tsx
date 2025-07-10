import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, MessageCircle, Send, Trash2, Edit } from "lucide-react";
import { commentWebSocketService } from "../services/comment-service";
import type { Comment, CreateCommentData } from "../services/comment-service";
import { toast } from "sonner";

interface CommentSectionProps {
  movieId: string;
  currentUserId?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  movieId,
  currentUserId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    console.log("CommentSection: useEffect triggered with movieId:", movieId);
    console.log("CommentSection: currentUserId:", currentUserId);

    // Connect to WebSocket and join movie room
    commentWebSocketService.connect();
    commentWebSocketService.joinMovieRoom(movieId, (loadedComments) => {
      console.log("CommentSection: Comments loaded:", loadedComments);
      setComments(loadedComments);
    });

    // Listen for real-time updates
    commentWebSocketService.onCommentCreated((comment) => {
      setComments((prev) => [comment, ...prev]);
      toast.success("Comment added successfully!");
    });

    commentWebSocketService.onCommentUpdated((updatedComment) => {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
      toast.success("Comment updated successfully!");
    });

    commentWebSocketService.onCommentRemoved((data) => {
      setComments((prev) => prev.filter((comment) => comment.id !== data.id));
      toast.success("Comment removed successfully!");
    });

    commentWebSocketService.onCommentError((error) => {
      toast.error(error.message || "An error occurred");
    });

    // Cleanup on unmount
    return () => {
      commentWebSocketService.leaveMovieRoom(movieId);
      commentWebSocketService.offCommentCreated();
      commentWebSocketService.offCommentUpdated();
      commentWebSocketService.offCommentRemoved();
      commentWebSocketService.offCommentError();
    };
  }, [movieId]);

  const handleSubmitComment = async () => {
    if (!currentUserId) {
      toast.error("Please login to add a comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    const commentData: CreateCommentData = {
      content: newComment.trim(),
      rating,
      userId: currentUserId,
      movieId,
    };

    commentWebSocketService.createComment(
      commentData,
      () => {
        setNewComment("");
        setRating(5);
        setIsSubmitting(false);
      },
      (error) => {
        toast.error(error.message || "Failed to add comment");
        setIsSubmitting(false);
      }
    );
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
    setEditRating(comment.rating);
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    commentWebSocketService.updateComment(
      {
        id: commentId,
        content: editContent.trim(),
        rating: editRating,
      },
      () => {
        setEditingComment(null);
        setEditContent("");
        setEditRating(5);
      },
      (error) => {
        toast.error(error.message || "Failed to update comment");
      }
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    commentWebSocketService.removeComment(
      commentId,
      movieId,
      () => {
        // Comment will be removed via WebSocket event
      },
      (error) => {
        toast.error(error.message || "Failed to delete comment");
      }
    );
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : ""
            }`}
            disabled={!interactive}
          >
            <Star
              className={`w-4 h-4 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  console.log("CommentSection: Rendering with comments:", comments);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-4" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Add Comment Form */}
      {currentUserId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add a Comment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              {renderStars(rating, true, setRating)}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                placeholder="Share your thoughts about this movie..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            <Button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
              className="w-full sm:w-auto"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                {editingComment === comment.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating</label>
                      {renderStars(editRating, true, setEditRating)}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Comment</label>
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={!editContent.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingComment(null);
                          setEditContent("");
                          setEditRating(5);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Comment Display
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback>
                            {comment.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {comment.user.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {renderStars(comment.rating)}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                      </div>
                      {currentUserId === comment.user.id && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditComment(comment)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
