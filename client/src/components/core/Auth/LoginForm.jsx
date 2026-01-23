import { useState, useEffect } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { useDispatch } from "react-redux"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"

import { login } from "../../../services/operations/authAPI"

function LoginForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const { email, password } = formData

    // Handle OAuth error from URL params
    useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'auth_failed') {
            toast.error('Google sign-in failed. Please try again.')
        } else if (error === 'server_error') {
            toast.error('Server error during sign-in. Please try again.')
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
        dispatch(login(email, password, navigate))
    }

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true)
        // Redirect to backend Google OAuth route
        window.location.href = `${process.env.REACT_APP_BASE_URL}/oauth/google`
    }

    return (
        <div className="mt-6 flex w-full flex-col gap-y-4">
            {/* Google Login Button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="flex items-center justify-center gap-3 w-full rounded-[8px] border border-richblack-700 bg-richblack-800 py-[10px] px-[12px] font-medium text-richblack-5 hover:bg-richblack-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-richblack-5 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <FcGoogle size={22} />
                )}
                <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-richblack-700 w-full"></div>
                <span className="bg-richblack-900 px-4 text-richblack-500 text-sm absolute">or</span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
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
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-50 transition-all"
                    />
                </label>
                <label className="relative">
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Password <sup className="text-pink-200">*</sup>
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
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-50 transition-all"
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
                    <Link to="/forgot-password">
                        <p className="mt-1 ml-auto max-w-max text-xs text-blue-100 hover:underline">
                            Forgot Password
                        </p>
                    </Link>
                </label>
                <button
                    type="submit"
                    className="mt-4 rounded-[8px] bg-yellow-50 py-[10px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-all duration-200"
                >
                    Sign In
                </button>
            </form>
        </div>
    )
}

export default LoginForm