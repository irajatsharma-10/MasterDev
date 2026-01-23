import { useState, useEffect } from "react"
import { FcGoogle } from "react-icons/fc"
import { useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"

function LoginForm() {
    const [searchParams] = useSearchParams()
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    // Handle OAuth error from URL params
    useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'auth_failed') {
            toast.error('Google sign-in failed. Please try again.')
        } else if (error === 'server_error') {
            toast.error('Server error during sign-in. Please try again.')
        }
    }, [searchParams])

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true)
        window.location.href = `${process.env.REACT_APP_BASE_URL}/oauth/google`
    }

    return (
        <div className="mt-6 flex w-full flex-col gap-y-4">
            <p className="text-center text-richblack-300 text-sm mb-2">
                Sign in securely with your Google account
            </p>

            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="flex items-center justify-center gap-3 w-full rounded-[8px] border border-richblack-700 bg-richblack-800 py-[14px] px-[12px] font-medium text-richblack-5 hover:bg-richblack-700 hover:border-richblack-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-richblack-5 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <FcGoogle size={24} />
                )}
                <span className="text-base">Continue with Google</span>
            </button>

            <div className="mt-4 p-4 bg-richblack-800 rounded-lg border border-richblack-700">
                <p className="text-richblack-300 text-xs text-center">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                    We use Google for secure authentication.
                </p>
            </div>
        </div>
    )
}

export default LoginForm
