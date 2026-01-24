import { useState, useEffect } from "react"
import { BiArrowBack } from "react-icons/bi"
import { FcGoogle } from "react-icons/fc"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import GoogleVerifyModal from "../components/common/GoogleVerifyModal"

function ForgotPassword() {
    const [searchParams] = useSearchParams()
    const [email, setEmail] = useState("")
    const [showVerifyModal, setShowVerifyModal] = useState(false)

    useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'email_mismatch') {
            toast.error('Google email does not match. Please use the correct email.')
        } else if (error === 'no_account') {
            toast.error('No account found with this email. Please sign up first.')
        } else if (error === 'auth_failed') {
            toast.error('Google verification failed. Please try again.')
        }
    }, [searchParams])

    const handleOnSubmit = (e) => {
        e.preventDefault()

        if (!email) {
            toast.error("Please enter your email address")
            return
        }

        // Store Google auth state for the modal
        const state = {
            mode: 'forgot_password',
            email: email.toLowerCase().trim()
        }
        sessionStorage.setItem('googleAuthState', JSON.stringify(state))
        sessionStorage.setItem('resetEmail', email.toLowerCase().trim())

        // Open the verification modal
        setShowVerifyModal(true)
    }

    const handleVerificationSuccess = () => {
        // The UpdatePassword page will be opened after successful verification
        // Success is handled by the redirect from the backend
        sessionStorage.removeItem('googleAuthState')
        sessionStorage.removeItem('resetEmail')
        toast.success('Identity verified! You can now set a new password.')
    }

    const handleVerificationError = (error) => {
        console.log('Verification error:', error)
        // Error is handled by the modal
    }

    const handleModalClose = () => {
        setShowVerifyModal(false)
    }

    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="max-w-[500px] p-4 lg:p-8">
                <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                    Reset your password
                </h1>
                <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                    Enter your email address and verify with Google to reset your password.
                </p>
                <form onSubmit={handleOnSubmit}>
                    <label className="w-full">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Email Address <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                            required
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 border-b border-richblack-700 focus:outline-none focus:border-yellow-50"
                        />
                    </label>
                    <button
                        type="submit"
                        className="mt-6 w-full flex items-center justify-center gap-2 rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 hover:bg-yellow-100 transition-all duration-200"
                    >
                        <FcGoogle size={20} />
                        <span>Verify with Google</span>
                    </button>
                </form>
                <p className="mt-4 text-richblack-300 text-sm text-center">
                    We'll verify your identity using your Google account linked to this email.
                </p>
                <div className="mt-6 flex items-center justify-between">
                    <Link to="/login">
                        <p className="flex items-center gap-x-2 text-richblack-5">
                            <BiArrowBack /> Back To Login
                        </p>
                    </Link>
                </div>
            </div>

            {/* Google Verification Modal */}
            <GoogleVerifyModal
                isOpen={showVerifyModal}
                onClose={handleModalClose}
                onSuccess={handleVerificationSuccess}
                onError={handleVerificationError}
                mode="forgot_password"
            />
        </div>
    )
}

export default ForgotPassword
