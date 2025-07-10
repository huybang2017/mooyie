import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  MovieResponse,
  FilterMovieRequest,
  CreateMovieRequest,
  UpdateMovieRequest,
  Movie,
} from "@/services/type";
import {
  createMovieApi,
  deleteMovieApi,
  getMovieByIdApi,
  getMoviesApi,
  getMoviesAdminApi,
  updateMovieApi,
} from "@/services/movie-service";

interface MovieState {
  movies: MovieResponse | null;
  adminMovies: MovieResponse | null;
  movieDetail: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: null,
  adminMovies: null,
  movieDetail: null,
  loading: false,
  error: null,
};

export const fetchMoviesThunk = createAsyncThunk(
  "movies/fetchAll",
  async (params: FilterMovieRequest, { rejectWithValue }) => {
    try {
      const response = await getMoviesApi(params);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch movies"
      );
    }
  }
);

export const fetchMovieByIdThunk = createAsyncThunk(
  "movies/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getMovieByIdApi(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch movie"
      );
    }
  }
);

export const createMovieThunk = createAsyncThunk(
  "movies/create",
  async (data: CreateMovieRequest, { rejectWithValue }) => {
    try {
      const response = await createMovieApi(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create movie"
      );
    }
  }
);

export const updateMovieThunk = createAsyncThunk(
  "movies/update",
  async (
    { id, data }: { id: string; data: UpdateMovieRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateMovieApi(id, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update movie"
      );
    }
  }
);

export const deleteMovieThunk = createAsyncThunk(
  "movies/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteMovieApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete movie"
      );
    }
  }
);

export const fetchAdminMoviesThunk = createAsyncThunk(
  "movies/fetchAdmin",
  async (params: FilterMovieRequest, { rejectWithValue }) => {
    try {
      const response = await getMoviesAdminApi(params);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch admin movies"
      );
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearMovieDetail: (state) => {
      state.movieDetail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAdminMovies: (state) => {
      state.adminMovies = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMoviesThunk.fulfilled,
        (state, action: PayloadAction<MovieResponse>) => {
          state.loading = false;
          state.movies = action.payload;
        }
      )
      .addCase(fetchMoviesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMovieByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMovieByIdThunk.fulfilled,
        (state, action: PayloadAction<Movie>) => {
          state.loading = false;
          state.movieDetail = action.payload;
        }
      )
      .addCase(fetchMovieByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createMovieThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createMovieThunk.fulfilled,
        (state, action: PayloadAction<Movie>) => {
          state.loading = false;
          // Add to both regular movies and admin movies
          if (state.movies?.data) {
            state.movies.data.unshift(action.payload);
            state.movies.total += 1;
          }
          if (state.adminMovies?.data) {
            state.adminMovies.data.unshift(action.payload);
            state.adminMovies.total += 1;
          }
        }
      )
      .addCase(createMovieThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(
        updateMovieThunk.fulfilled,
        (state, action: PayloadAction<Movie>) => {
          if (state.movies && state.movies.data) {
            const index = state.movies.data.findIndex(
              (m) => m.id === action.payload.id
            );
            if (index !== -1) {
              state.movies.data[index] = action.payload;
            }
          }

          if (state.movieDetail?.id === action.payload.id) {
            state.movieDetail = action.payload;
          }
        }
      )

      .addCase(
        deleteMovieThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          if (state.movies && state.movies.data) {
            state.movies.data = state.movies.data.filter(
              (m) => m.id !== action.payload
            );
            state.movies.total -= 1;
          }

          if (state.movieDetail?.id === action.payload) {
            state.movieDetail = null;
          }
        }
      )

      .addCase(fetchAdminMoviesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminMoviesThunk.fulfilled,
        (state, action: PayloadAction<MovieResponse>) => {
          state.loading = false;
          state.adminMovies = action.payload;
        }
      )
      .addCase(fetchAdminMoviesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMovieDetail, clearError, clearAdminMovies } = movieSlice.actions;
export default movieSlice.reducer;
