import React from 'react'
import toast from 'react-hot-toast';
import { catalogData } from '../apis';
import {apiConnector} from '../apiconnector'
export const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading;
    let result = [];
    try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
            {categoryId: categoryId,}
        )
        if(!response.data.success){
            throw new Error("Could not fetch Category page data")
        }
        result = response?.data;


    }catch(error){
        console.log("Error fetching catalog page data", error);
        toast.error("Failed to fetch catalog page data");
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}

