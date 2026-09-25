import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "creator" | "brand";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  selectedRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  selectedRole: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<UserRole>) => {
      state.selectedRole = action.payload;
    },

    signIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    signOut: (state) => {
      state.user = null;
      state.selectedRole = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    finishAuthCheck: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.isLoading = false;
    },
  },
});

export const { setSelectedRole, signIn, signOut, finishAuthCheck } =
  authSlice.actions;

export default authSlice.reducer;
