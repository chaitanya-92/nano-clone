import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "creator" | "brand";

interface User {
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  selectedRole: UserRole | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  selectedRole: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSelectedRole: (
      state,
      action: PayloadAction<UserRole>,
    ) => {
      state.selectedRole = action.payload;
    },

    signIn: (
      state,
      action: PayloadAction<User>,
    ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    signOut: (state) => {
      state.user = null;
      state.selectedRole = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setSelectedRole,
  signIn,
  signOut,
} = authSlice.actions;

export default authSlice.reducer;