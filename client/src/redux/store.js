import { configureStore } from "@reduxjs/toolkit"; 
import rootReducer from "./combinedReducers";
export const store = configureStore({
    reducer: rootReducer,// no need to pass the other reducers within the object
})