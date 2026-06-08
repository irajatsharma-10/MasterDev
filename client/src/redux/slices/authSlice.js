import { createSlice } from "@reduxjs/toolkit";



//  we fetch these state within the reactComponent using useSelector  
const initialState = {
    signupData: null,
    loading: false,
    token: (() => {
        try {
            const storedToken = localStorage.getItem("token");
            return storedToken ? JSON.parse(storedToken) : null;
        } catch {
            return null;
        }
    })(),
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, value) {
            // state is the current state initially set to null
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload;
        },
    },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
