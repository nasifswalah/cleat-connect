import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
    },
  },
});

export const { signinSuccess, signOutUserSuccess
 } = userSlice.actions;

export default userSlice.reducer;
