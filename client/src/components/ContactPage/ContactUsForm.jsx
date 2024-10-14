import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import CountryCode from "../../data/countrycode.json"
import { apiConnector } from "../../services/apiconnector"
import { contactusEndpoint } from "../../services/apis"
import toast from 'react-hot-toast'

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm()
    // The data object is a plain JavaScript object where each key corresponds to the name of a form field, and the value is the user input for that field. The structure of data will match the names and values of the fields in your form 
    const submitContactForm = async (data) => {
        console.log("Form Data - ", data)
        try {
            setLoading(true)
            const response = await apiConnector(
                "POST",
                contactusEndpoint.CONTACT_US_API,
                data
            )
            console.log("Email Res - ", response)
            toast.success("Feedback sent successfully")
            setLoading(false)
        } catch (error) {
            console.log("Getting the error message - ", error)
            toast.error("Feedback not sent successfully")
            setLoading(false)
        }
    }


    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                lastname: "",
                firstname: "",
                email: "",
                phonenumber: "",
                message: "",
            })
        }
    }, [reset, isSubmitSuccessful])

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(submitContactForm)}
        >
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="first-name" className="lable-style">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstname"
                        id="first-name"
                        placeholder="Enter first name"
                        className="form-style"
                        {...register("firstname", { required: true })}
                    />
                    {errors.firstname && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your name.
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="last-name" className="lable-style">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastname"
                        id="last-name"
                        placeholder="Enter last name"
                        className="form-style"
                        {...register("lastname")}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="lable-style">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email address"
                    className="form-style"
                    {...register("email", { required: true })}
                />
                {errors.email && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter your Email address.
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="phonenumber" className="lable-style">
                    Phone Number
                </label>

                <div className="flex gap-5">
                    <select
                        type="text"
                        name="countrycode"
                        id="country-code"
                        placeholder="Enter first name"
                        className="form-style max-w-20"
                        {...register("countrycode", { required: true })}
                    >
                        {CountryCode.map((ele, i) => {
                            return (
                                <option key={i} value={ele.code}>
                                    {ele.code}
                                </option>
                            )
                        })}
                    </select>
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input
                            type="number"
                            name="phonenumber"
                            id="phone-number"
                            placeholder="12345 67890"
                            className="form-style"
                            {...register("phonenumber", {
                                required: {
                                    value: true,
                                    message: "Please enter your Phone Number.",
                                },
                                maxLength: { value: 12, message: "Invalid Phone Number" },
                                minLength: { value: 10, message: "Invalid Phone Number" },
                            })}
                        />
                    </div>
                </div>
                {errors.phonenumber && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        {errors.phonenumber.message}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="lable-style">
                    Message
                </label>
                <textarea
                    name="message"
                    id="message"
                    cols="30"
                    rows="7"
                    placeholder="Enter your message here"
                    className="form-style"
                    {...register("message", { required: true })}
                />
                {errors.message && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter your Message.
                    </span>
                )}
            </div>

            <button
                disabled={loading}
                type="submit"
                className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
                        ${!loading &&
                    "transition-all duration-200 hover:scale-95 hover:shadow-none"
                    }  disabled:bg-richblack-500 sm:text-[16px] `}
            >
                Send Message
            </button>
        </form>
    )
}

export default ContactUsForm