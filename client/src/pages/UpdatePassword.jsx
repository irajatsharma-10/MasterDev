import { useState, useEffect } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { apiConnector } from "../services/apiconnector"
import { oauthEndpoints } from "../services/apis"

function UpdatePassword() {
    const [searchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [tokenValid, setTokenValid] = useState(true)
    const [resetComplete, setResetComplete] = useState(false)

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { password, confirmPassword } = formData
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            setTokenValid(false)
            toast.error('Invalid reset link. Please try again.')
        }
    }, [token])

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }

        // Check password complexity
        const hasUppercase = /[A-Z]/.test(password)
        const hasLowercase = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        if (!hasUppercase || !hasLowercase || !hasNumber) {
            toast.error('Password must contain uppercase, lowercase, and a number')
            return
        }

        setIsLoading(true)
        const toastId = toast.loading('Resetting password...')

        try {
            const response = await apiConnector('POST', oauthEndpoints.RESET_PASSWORD_GOOGLE_API, {
                token,
                password,
                confirmPassword
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success('Password reset successfully!')
            setResetComplete(true)
        } catch (error) {
            console.error('Reset password error:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to reset password')

            if (error.response?.status === 401) {
                setTokenValid(false)
            }
        } finally {
            toast.dismiss(toastId)
            setIsLoading(false)
        }
    }

    if (!tokenValid) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="max-w-[500px] p-4 lg:p-8 text-center">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                        Invalid Reset Link
                    </h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        The reset link is invalid or has expired. Please try resetting your password again.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="mt-6 inline-block rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        )
    }

    if (resetComplete) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="max-w-[500px] p-4 lg:p-8 text-center">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                        Password Reset Complete
                    </h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        Your password has been reset successfully. You can now login with your new password.
                    </p>
                    <Link
                        to="/login"
                        className="mt-6 inline-block rounded-[8px] bg-yellow-50 py-[12px] px-[20px] font-medium text-richblack-900"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="max-w-[500px] p-4 lg:p-8">
                <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                    Choose new password
                </h1>
                <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                    Almost done. Enter your new password and you're all set.
                </p>
                <form onSubmit={handleOnSubmit}>
                    <label className="relative block">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            New Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={handleOnChange}
                            placeholder="Enter Password"
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
                    <label className="relative mt-4 block">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Confirm New Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleOnChange}
                            placeholder="Confirm Password"
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-richblack-900 border-t-transparent rounded-full animate-spin"></div>
                                <span>Resetting...</span>
                            </div>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
                <div className="mt-6 flex items-center justify-between">
                    <Link to="/login">
                        <p className="flex items-center gap-x-2 text-richblack-5">
                            <BiArrowBack /> Back To Login
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default UpdatePassword
