import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authAPI"

function LoginForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false)

    const { email, password } = formData

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        await dispatch(login(email, password, navigate))
        setIsLoading(false)
    }

    return (
        <div className="mt-6 flex w-full flex-col gap-y-4">
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
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 border-b border-richblack-700 focus:outline-none focus:border-yellow-50"
                    />
                </label>

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
                    <Link to="/forgot-password">
                        <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                            Forgot Password?
                        </p>
                    </Link>
                </label>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 rounded-[8px] bg-yellow-50 py-[10px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-richblack-900 border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

            <p className="text-richblack-300 text-sm text-center mt-4">
                Don't have an account?{" "}
                <Link to="/signup" className="text-yellow-50 hover:underline">
                    Sign up
                </Link>
            </p>

            <div className="mt-2 p-4 bg-richblack-800 rounded-lg border border-richblack-700">
                <p className="text-richblack-300 text-xs text-center">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    )
}

export default LoginForm
