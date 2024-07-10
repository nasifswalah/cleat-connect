import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.loading = true;
    },
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signinFailure: (state, action) => {
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    signOutUserFailure: (state, action) => {
      state.loading = true;
    },
  },
});

export const { signinStart, signinSuccess, signinFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } = userSlice.actions;

export default userSlice.reducer;
