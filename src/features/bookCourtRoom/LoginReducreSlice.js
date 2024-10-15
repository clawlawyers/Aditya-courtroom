import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { decryptData } from "../../utils/encryption";

export const retrieveCourtroomAuth = createAsyncThunk(
  "auth/retrieveAuth",
  async () => {
    const storedAuth = localStorage.getItem("specific-courtroom-auth");
    console.log(storedAuth);
    if (storedAuth) {
      const parsedUser = JSON.parse(storedAuth);
      if (parsedUser.expiresAt < new Date().valueOf()) return null;
      const props = await fetch(
        `${NODE_API_ENDPOINT}/specificLawyerCourtroom/getCourtroomUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${parsedUser.token}`,
          },
        }
      );
      const parsedProps = await props.json();
      const decryptedKey = decryptData(
        parsedProps.data.key,
        process.env.REACT_APP_KEY
      );

      return {
        user: parsedProps.data,
        key: decryptedKey,
      };
    } else return null;
  }
);

// Create a slice of the Redux store
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: "",
    caseOverview: "NA",
    firstDraft: "",
    fightingSideModal: false,
    authKey: "",
  },
  reducers: {
    login(state, action) {
      const { user } = action.payload;
      state.user = user;
      localStorage.setItem("specific-courtroom-auth", JSON.stringify(user));
    },
    logout(state) {
      state.user = "";
      localStorage.removeItem("specific-courtroom-auth");
    },
    setOverview(state, action) {
      state.caseOverview = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setFightingSideModal(state, action) {
      state.fightingSideModal = action.payload;
    },
    setFirstDraftAction(state, action) {
      state.firstDraft = action.payload.draft;
    },
    setAuthKey(state, action) {
      state.authKey = action.payload.key;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveCourtroomAuth.fulfilled, (state, action) => {
      if (action.payload && action.payload.user) {
        state.user = action.payload.user;
        state.authKey = action.payload.key;
      }
    });
  },
});

// Export the action creators
export const {
  login,
  logout,
  setOverview,
  setUser,
  setFightingSideModal,
  setFirstDraftAction,
  setAuthKey,
} = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
