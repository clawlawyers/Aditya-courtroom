import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { decryptData } from "../../utils/encryption";

export const retrieveDrafterProQuestions = createAsyncThunk(
  "drafts/retrieveDrafterPro",
  async ({ query, token, key }) => {
    try {
      const props = await fetch(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/api/pro_application`,
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
      //   console.log(parsedProps);
      return {
        drafterDoc: parsedProps.data.fetchedProApplication.application,
      };
    } catch (error) {
      console.log(error);
    }
  }
);

// Create a slice of the Redux store
const drafterProSlice = createSlice({
  name: "drafterPro",
  initialState: {
    drafterDoc: null,
  },
  reducers: {
    editDrafterPro(state, action) {
      state.drafterDoc = action.payload.drafterDoc;
    },
    removeDrafterPro(state) {
      state.drafterDoc = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveDrafterProQuestions.fulfilled, (state, action) => {
      if (action.payload && action.payload.drafterDoc) {
        state.drafterDoc = action.payload.drafterDoc;
      }
    });
  },
});

// Export the action creators
export const { editDrafterPro, removeDrafterPro } = drafterProSlice.actions;

// Export the reducer to be used in the store
export default drafterProSlice.reducer;
