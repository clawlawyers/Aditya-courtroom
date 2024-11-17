import { createSlice } from "@reduxjs/toolkit";

export const PopupSlice = createSlice({
    name: "popup",
    initialState: {
        open: false,
        tutorial:false
    },

    reducers: {
        open(state) {
            state.open = true;
        },
        close(state) {
            state.open = false;
        },
        setTutorial(state){
            state.tutorial = true
        },
        setTutorialFalse(state){
            state.tutorial = false
        }
    }
});

export const { open, close , setTutorial , setTutorialFalse } = PopupSlice.actions;

export default PopupSlice.reducer;