import { toast } from "react-hot-toast";
import { setUser } from "../../redux/slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateProfile(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
                // 'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            });
            console.log("UPDATE_PROFILE_API API RESPONSE:", response);

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to update profile.");
            }

            const userDetails = response.data.updatedUserDetails || {};
            if(userDetails){
                console.log(userDetails.image)
            }
            else{
                throw new Error("Image type is not valid to update")
            }
            let userImage = userDetails.image ? userDetails.image : `https://api.dicebear.com/5.x/initials/svg?seed=${userDetails.firstName || ""} ${userDetails.lastName || ""}`;

            dispatch(setUser({ ...userDetails, image:userImage }));
            toast.success("Profile Updated Successfully");
        } catch (error) {
            console.error("UPDATE_PROFILE_API API ERROR:", error);
            toast.error(`Could Not Update Profile: ${error.message || "An error occurred."}`);
        } finally {
            toast.dismiss(toastId);
        }
    };
}
export function updateDisplayPicture(token,formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    // "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            )
            console.log(
                "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
                response
            )

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Display Picture Updated Successfully")
            dispatch(setUser(response.data.data))
        } catch (error) {
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error.message)

            toast.error("Could Not Update Display Picture")
        }
        toast.dismiss(toastId)
    }
}

export async function changePassword(token, formData) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
            Authorization: `Bearer ${token}`,
        });
        console.log("CHANGE_PASSWORD_API API RESPONSE:", response);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to change password.");
        }

        toast.success("Password Changed Successfully");
    } catch (error) {
        console.error("CHANGE_PASSWORD_API API ERROR:", error);
        toast.error(`Could Not Change Password: ${error.response?.data?.message || error.message || "An error occurred."}`);
    } finally {
        toast.dismiss(toastId);
    }
}

export function deleteProfile(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
                Authorization: `Bearer ${token}`,
            });
            console.log("DELETE_PROFILE_API API RESPONSE:", response);

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to delete profile.");
            }

            toast.success("Profile Deleted Successfully");
            dispatch(logout(navigate));
        } catch (error) {
            console.error("DELETE_PROFILE_API API ERROR:", error);
            toast.error(`Could Not Delete Profile: ${error.message || "An error occurred."}`);
        } finally {
            toast.dismiss(toastId);
        }
    };
}
