import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  darkMode: false,
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.loading = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { setLoader, setDarkMode
 } = generalSlice.actions;

export default generalSlice.reducer;
