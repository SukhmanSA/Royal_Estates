import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie"

    const initialState = {
        currentUser:null,
        loading:false,
        error:null
    }

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        loginStart(state,action){
            state.loading = true
        },
        loginSuccess(state,action){
            state.currentUser = action.payload
            state.loading = false
            state.error = null
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
        },
        loginFailure(state,action){
            state.error = action.payload
            state.loading = false
        },
        logout(state) {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem("currentUser");
            Cookies.remove("token");
        }
    }
})

export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;