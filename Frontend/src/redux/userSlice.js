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
    signinFailure: (state) => {
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    signOutUserFailure: (state) => {
      state.loading = false;
    },
    setLoader: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { signinStart, signinSuccess, signinFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure, setLoader } = userSlice.actions;

export default userSlice.reducer;
