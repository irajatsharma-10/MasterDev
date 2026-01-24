import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { setToken } from "../../../redux/slices/authSlice"
import { setUser } from "../../../redux/slices/profileSlice"
import Tab from "../../common/Tab"
import GoogleVerifyModal from "../../common/GoogleVerifyModal"

function SignupForm() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)
    const [showVerifyModal, setShowVerifyModal] = useState(false)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { firstName, lastName, email, password, confirmPassword } = formData

    // Handle OAuth errors from URL params
    useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'auth_failed') {
            toast.error('Google verification failed. Please try again.')
        } else if (error === 'server_error') {
            toast.error('Server error. Please try again.')
        } else if (error === 'email_mismatch') {
            toast.error('Google email does not match. Please use the same email.')
        } else if (error === 'user_exists') {
            toast.error('An account with this email already exists. Please login instead.')
        }
    }, [searchParams])

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()

        // Validations
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            toast.error("Please fill all fields")
            return
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters")
            return
        }

        // Check password complexity
        const hasUppercase = /[A-Z]/.test(password)
        const hasLowercase = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        if (!hasUppercase || !hasLowercase || !hasNumber) {
            toast.error("Password must contain uppercase, lowercase, and a number")
            return
        }

        // Store signup data in sessionStorage
        const signupData = {
            firstName,
            lastName,
            email: email.toLowerCase().trim(),
            password,
            accountType,
        }
        sessionStorage.setItem('pendingSignup', JSON.stringify(signupData))

        // Store Google auth state for the modal
        const state = {
            mode: 'signup',
            email: email.toLowerCase().trim(),
            accountType
        }
        sessionStorage.setItem('googleAuthState', JSON.stringify(state))

        // Open the verification modal
        setShowVerifyModal(true)
    }

    const handleVerificationSuccess = (data) => {
        // Clear stored data
        sessionStorage.removeItem('pendingSignup')
        sessionStorage.removeItem('googleAuthState')

        // Set auth state
        dispatch(setToken(data.token))
        dispatch(setUser(data.user))
        localStorage.setItem('token', JSON.stringify(data.token))
        localStorage.setItem('user', JSON.stringify(data.user))

        toast.success('Account created successfully!')
        navigate('/dashboard/my-profile')
    }

    const handleVerificationError = (error) => {
        console.log('Verification error:', error)
        // Error is handled by the modal, just close it if needed
    }

    const handleModalClose = () => {
        setShowVerifyModal(false)
    }

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
        <div className="mt-6 flex w-full flex-col gap-y-4">
            {/* Account Type Tab */}
            <Tab tabData={tabData} field={accountType} setField={setAccountType} />

            {/* Signup Form */}
            <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
                <div className="flex gap-x-4">
                    <label className="w-full">
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
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 border-b border-richblack-700 focus:outline-none focus:border-yellow-50"
                        />
                    </label>
                    <label className="w-full">
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
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 border-b border-richblack-700 focus:outline-none focus:border-yellow-50"
                        />
                    </label>
                </div>

                <label className="w-full">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Email Address <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                        required
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleOnChange}
                        placeholder="Enter email address"
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 border-b border-richblack-700 focus:outline-none focus:border-yellow-50"
                    />
                </label>

                <div className="flex gap-x-4">
                    <label className="relative w-full">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={handleOnChange}
                            placeholder="Enter password"
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 border-b border-richblack-700 focus:outline-none focus:border-yellow-50"
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
                    <label className="relative w-full">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleOnChange}
                            placeholder="Confirm password"
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5 border-b border-richblack-700 focus:outline-none focus:border-yellow-50"
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
                    className="mt-4 flex items-center justify-center gap-2 rounded-[8px] bg-yellow-50 py-[10px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-all duration-200"
                >
                    <FcGoogle size={20} />
                    <span>Verify with Google & Create Account</span>
                </button>
            </form>

            <p className="text-richblack-300 text-sm text-center mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-yellow-50 hover:underline">
                    Sign in
                </Link>
            </p>

            {/* Google Verification Modal */}
            <GoogleVerifyModal
                isOpen={showVerifyModal}
                onClose={handleModalClose}
                onSuccess={handleVerificationSuccess}
                onError={handleVerificationError}
                mode="signup"
            />
        </div>
    )
}

export default SignupForm
