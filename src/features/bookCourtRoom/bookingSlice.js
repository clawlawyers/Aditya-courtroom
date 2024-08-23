// Step 1: Import createSlice from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';

// Step 2: Define the initial state
const initialState = {
  bookingData: {}
};

// Step 3: Create the slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingData: (state, action) => {
      state.bookingData = action.payload;
    },
  },
});

// Step 4: Export the actions and reducer
export const { setBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;