import { getAverageRating } from "./../../services/comment-service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Comment,
  CommentResponse,
  FilterCommentRequest,
  PaginationResponse,
} from "@/services/type";
import { deleteCommentById, getAllComments } from "@/services/comment-service";

interface AdminCommentsState {
  commentsAdmin: CommentResponse | null;
  averageRating: { averageRating: number } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminCommentsState = {
  commentsAdmin: null,
  averageRating: null,
  loading: false,
  error: null,
};

export const fetchAdminCommentsThunk = createAsyncThunk<
  PaginationResponse & { data: Comment[] },
  FilterCommentRequest
>("comment/fetchAdminComments", async (params, { rejectWithValue }) => {
  try {
    const response = await getAllComments(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch comments"
    );
  }
});

export const deleteCommentThunk = createAsyncThunk<string, string>(
  "comment/deleteComment",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteCommentById(id);
      return res.data.id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

export const getAverageRatingThunk = createAsyncThunk<
  { averageRating: number },
  string
>("comment/getAverageRating", async (movieId, { rejectWithValue }) => {
  try {
    const response = await getAverageRating(movieId);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to get average rating"
    );
  }
});

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCommentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCommentsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsAdmin = action.payload as CommentResponse;
      })
      .addCase(fetchAdminCommentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommentThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.commentsAdmin) {
          state.commentsAdmin.data = state.commentsAdmin.data.filter(
            (c) => c.id !== action.payload
          );
        }
      })
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAverageRatingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAverageRatingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.averageRating = action.payload;
      })
      .addCase(getAverageRatingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default commentSlice.reducer;
