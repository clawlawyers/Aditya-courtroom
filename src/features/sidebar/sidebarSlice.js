import { createSlice } from "@reduxjs/toolkit";

export const SidebarSlice = createSlice({
    name: "sidebar",
    initialState: {
        collapsed: false,
        sidebarTut:false,
        inputCaseTutorial : false,
        driveUpload:false,
        mainTut:false
        
    },

    reducers: {
        toggle(state) {
            state.collapsed = !state.collapsed;
        },
        collapse(state) {
            state.collapsed = true;
        },
        expand(state) {
            state.collapsed = false;
        },
        setTutorial(state) {
            state.collapsed = true;
        },
        setTutorialFalse(state) {
            state.collapsed = false;
        },
        setinputCaseTutorial(state) {
            state.inputCaseTutorial = true;
        },
        setdevices(state) {
            state.driveUpload = true;
        },
        setmaintut(state) {
            state.mainTut = true;
        }
    }
});

export const { toggle, collapse, expand, setTutorial, setTutorialFalse, setinputCaseTutorial, setdevices, setmaintut } = SidebarSlice.actions;

export default SidebarSlice.reducer;