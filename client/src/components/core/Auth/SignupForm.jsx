import { useState } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../redux/slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"

function SignupForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // student or instructor
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Handle Google Sign Up
    const handleGoogleSignup = () => {
        setIsGoogleLoading(true)
        // Note: Google OAuth creates Student accounts by default
        // Users can change to Instructor in settings after signup
        window.location.href = `${process.env.REACT_APP_BASE_URL}/oauth/google`
    }


    // destructuring the form data to make it easier for referencing
    const { firstName, lastName, email, password, confirmPassword } = formData

    // Handle input fields, when some value changes
    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    // Handle Form Submission
    const handleOnSubmit = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords Do Not Match")
            return
        }
        const signupData = {
            ...formData,
            accountType,
        }

        // Setting signup data to state
        // To be used after otp verification
        dispatch(setSignupData(signupData))
        // Send OTP to user for verification
        dispatch(sendOtp(formData.email, navigate))

        // Reset
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        })
        setAccountType(ACCOUNT_TYPE.STUDENT)
    }

    // data to pass to Tab component
    const tabData = [
        {
            id: 1,
            tabName: "Student",
            type: ACCOUNT_TYPE.STUDENT,
        },
        {
            id: 2,
            tabName: "Instructor",
            type: ACCOUNT_TYPE.INSTRUCTOR,
        },
    ]

    return (
        <div className="flex w-full flex-col gap-y-4">
            {/* Google Sign Up Button */}
            <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                className="flex items-center justify-center gap-3 w-full rounded-[8px] border border-richblack-700 bg-richblack-800 py-[10px] px-[12px] font-medium text-richblack-5 hover:bg-richblack-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-richblack-5 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <FcGoogle size={22} />
                )}
                <span>Sign up with Google</span>
            </button>
            <p className="text-xs text-richblack-400 text-center -mt-2">
                Google signup creates a Student account by default
            </p>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-richblack-700 w-full"></div>
                <span className="bg-richblack-900 px-4 text-richblack-500 text-sm absolute">or</span>
            </div>

            {/* Tab */}
            {/* allows shifting between instructor and student  */}
            <Tab tabData={tabData} field={accountType} setField={setAccountType} />
            {/* Form */}
            <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
                <div className="flex gap-x-4">
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            First Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={handleOnChange}
                            placeholder="Enter first name"
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        />
                    </label>
                    <label>
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Last Name <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={handleOnChange}
                            placeholder="Enter last name"
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        />
                    </label>
                </div>
                <label className="w-full">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Email Address <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                        required
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleOnChange}
                        placeholder="Enter email address"
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                    />
                </label>
                <div className="flex gap-x-4">
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Create Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={handleOnChange}
                            placeholder="Enter Password"
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                        />
                        <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </label>
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleOnChange}
                            placeholder="Confirm Password"
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                        />
                        <span
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="mt-4 rounded-[8px] bg-yellow-50 py-[10px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-all duration-200"
                >
                    Create Account
                </button>
            </form>
        </div>
    )
}

export default SignupForm