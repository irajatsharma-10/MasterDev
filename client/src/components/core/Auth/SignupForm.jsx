import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import { useSearchParams } from "react-router-dom"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Tab from "../../common/Tab"

function SignupForm() {
    const [searchParams] = useSearchParams()
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    // Handle OAuth error from URL params
    useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'auth_failed') {
            toast.error('Google sign-up failed. Please try again.')
        } else if (error === 'server_error') {
            toast.error('Server error during sign-up. Please try again.')
        }
    }, [searchParams])

    const handleGoogleSignup = () => {
        setIsGoogleLoading(true)
        // Pass account type to backend via state parameter
        window.location.href = `${process.env.REACT_APP_BASE_URL}/oauth/google?accountType=${accountType}`
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
        <div className="flex w-full flex-col gap-y-4">
            <p className="text-center text-richblack-300 text-sm mb-2">
                Create your account securely with Google
            </p>

            {/* Account Type Tab */}
            <Tab tabData={tabData} field={accountType} setField={setAccountType} />

            <p className="text-xs text-richblack-400 text-center">
                Select your account type above before signing up
            </p>

            {/* Google Sign Up Button */}
            <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                className="flex items-center justify-center gap-3 w-full rounded-[8px] border border-richblack-700 bg-richblack-800 py-[14px] px-[12px] font-medium text-richblack-5 hover:bg-richblack-700 hover:border-richblack-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-richblack-5 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <FcGoogle size={24} />
                )}
                <span className="text-base">
                    Sign up as {accountType === ACCOUNT_TYPE.STUDENT ? "Student" : "Instructor"} with Google
                </span>
            </button>

            <div className="mt-4 p-4 bg-richblack-800 rounded-lg border border-richblack-700">
                <p className="text-richblack-300 text-xs text-center">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                    We use Google for secure authentication to prevent fake accounts.
                </p>
            </div>
        </div>
    )
}

export default SignupForm
