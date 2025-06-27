# Mooyie Frontend

A React application with Redux state management and React Router for navigation.

## Features

- **Redux Toolkit** for state management
- **React Router** for client-side routing
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Authentication** with JWT tokens
- **Protected Routes** for authenticated users

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── routes/             # Routing configuration
├── store/              # Redux store and slices
│   ├── slices/         # Redux slices (auth, movies, bookings)
│   └── hooks.ts        # Typed Redux hooks
├── services/           # API services
└── App.tsx            # Main app component
```

## Redux Store

The application uses Redux Toolkit with the following slices:

- **Auth Slice**: Manages user authentication state
- **Movie Slice**: Handles movie data and operations
- **Booking Slice**: Manages booking data and operations

## Routing

The application uses React Router with the following routes:

- `/` - Home page
- `/movies` - Movie listings
- `/movies/:id` - Movie details
- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile (protected)
- `/bookings` - User bookings (protected)
- `/bookings/:id` - Booking details (protected)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with:
   ```
   VITE_API_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Redux Hooks

Use the typed hooks for Redux operations:

```typescript
import { useAppSelector, useAppDispatch } from './store/hooks';

// In your component
const dispatch = useAppDispatch();
const { user, isAuthenticated } = useAppSelector((state) => state.auth);
```

### API Service

Use the API service for backend communication:

```typescript
import { apiService } from './services/api';

// Example usage
const movies = await apiService.get('/movies');
const user = await apiService.post('/auth/login', credentials);
```

### Protected Routes

Wrap components that require authentication:

```typescript
import ProtectedRoute from './routes/ProtectedRoute';

<ProtectedRoute>
  <YourProtectedComponent />
</ProtectedRoute>
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
