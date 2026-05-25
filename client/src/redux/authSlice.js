import { createSlice } from "@reduxjs/toolkit";

const stored = localStorage.getItem("user");
const initialUser = stored ? JSON.parse(stored) : null;
const initialToken =
  localStorage.getItem("token") || initialUser?.token || null;

if (initialToken && !localStorage.getItem("token")) {
  localStorage.setItem("token", initialToken);
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    token: initialToken,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token, ...user } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    setUser: (state, action) => {
      const { token, ...profile } = action.payload;
      state.user = { ...state.user, ...profile };
      if (token) {
        state.token = token;
        localStorage.setItem("token", token);
      }
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
