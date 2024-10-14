import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../../../services/operations/SettingsAPI';
import IconBtn from '../../../common/IconBtn';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import 'react-calendar/dist/Calendar.css';
import { formattedDate } from '../../../../utils/dateFormatter.js';

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { control, register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            dateOfBirth: user?.additionalDetails?.dateOfBirth ? new Date(user.additionalDetails.dateOfBirth) : null,
            gender: user?.additionalDetails?.gender || '',
            contactNumber: user?.additionalDetails?.contactNumber || '',
            about: user?.additionalDetails?.about || '',
        }
    });
    // const gender = watch("gender"); // watch gender field value

    
    const submitProfileForm = async (data) => {
        try {
            // data is the form data 
            dispatch(updateProfile(token, data));
            // Navigate or show success message
        } catch (error) {
            console.log("ERROR MESSAGE - ", error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit(submitProfileForm)}>
            {/* Profile Information */}
            <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <h2 className="text-lg font-semibold text-richblack-5">
                    Profile Information
                </h2>

                {/* First Name */}
                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="firstName" className="label-style">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            placeholder="Enter first name"
                            className="form-style"
                            {...register("firstName", { required: { value: true, message: "Please enter your first name." } })}
                        />
                        {errors.firstName && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.firstName.message}
                            </span>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="lastName" className="label-style">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="Enter last name"
                            className="form-style"
                            {...register("lastName", { required: "Please enter your last name." })}
                        />
                        {errors.lastName && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.lastName.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="dateOfBirth" className="label-style">
                            Date of Birth
                        </label>
                        <Controller
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    // selected={new Date()}
                                    onChange={(date) => field.onChange(date)}
                                    dateFormat="dd/MM/yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    placeholderText={field.value ? formattedDate(field.value) : 'dd/mm/yyyy'}
                                    // showIcon
                                    // icon = {<MdDateRange />}
                                    yearDropdown
                                    scrollableYearDropdown
                                    toggleCalendarOnIconClick
                                    className='gap-10 form-style mr-10'
                                />
                            )}
                        />
                        {errors.dateOfBirth && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.dateOfBirth.message}
                            </span>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="gender" className="label-style">
                            Gender
                        </label>
                        <select
                            id="gender"
                            className="form-style"
                            {...register("gender", { required: "Please select your gender." })}
                            defaultValue= ""

                        >
                            <option disabled value= "" hidden >
                                Select gender
                            </option>
                            {genders.map((gender, i) => (
                                <option key={i} value={gender}>
                                    {gender}
                                </option>
                            ))}
                        </select>
                        {errors.gender && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.gender.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Contact Number */}
                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="contactNumber" className="label-style">
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            id="contactNumber"
                            placeholder="Enter Contact Number"
                            className="form-style"
                            {...register("contactNumber", {
                                required: "Please enter your contact number.",
                                minLength: { value: 10, message: "Contact number must be at least 10 digits." },
                                maxLength: { value: 12, message: "Contact number cannot exceed 12 digits." },
                            })}
                        />
                        {errors.contactNumber && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.contactNumber.message}
                            </span>
                        )}
                    </div>

                    {/* About */}
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="about" className="label-style">
                            About
                        </label>
                        <input
                            type="text"
                            id="about"
                            placeholder="Enter Bio Details"
                            className="form-style"
                            {...register("about", { required: "Please enter your bio details." })}
                        />
                        {errors.about && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.about.message}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard/my-profile")}
                    className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                >
                    Cancel
                </button>
                <IconBtn type="submit" text="Save" />
            </div>
        </form>
    );
}
