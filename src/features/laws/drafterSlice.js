import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { decryptData } from "../../utils/encryption";

export const retrieveDrafterQuestions = createAsyncThunk(
  "drafts/retrieveDrafter",
  async ({ query, token, key }) => {
    try {
      const props = await fetch(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/application`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: query }),
        }
      );
      const parsedProps = await props.json();
      console.log(parsedProps);
      return {
        drafterDoc: decryptData(parsedProps.data.application.application, key),
      };
    } catch (error) {
      console.log(error);
    }
  }
);

// Create a slice of the Redux store
const drafterSlice = createSlice({
  name: "drafter",
  initialState: {
    drafterDoc: null,
  },
  reducers: {
    editDrafter(state, action) {
      state.drafterDoc = action.payload.drafterDoc;
    },
    removeDrafter(state) {
      state.drafterDoc = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveDrafterQuestions.fulfilled, (state, action) => {
      if (action.payload && action.payload.drafterDoc) {
        state.drafterDoc = action.payload.drafterDoc;
      }
    });
  },
});

// Export the action creators
export const { editDrafter, removeDrafter } = drafterSlice.actions;

// Export the reducer to be used in the store
export default drafterSlice.reducer;
