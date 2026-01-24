import { useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { IoClose } from "react-icons/io5"

function GoogleVerifyModal({ isOpen, onClose, onSuccess, onError, mode = "signup" }) {
    const [status, setStatus] = useState("idle") // idle, verifying, success, error
    const [errorMessage, setErrorMessage] = useState("")
    const [popup, setPopup] = useState(null)

    const titles = {
        signup: "Verify Your Email",
        forgot_password: "Verify Your Identity"
    }

    const descriptions = {
        signup: "Please sign in with Google to verify your email address.",
        forgot_password: "Please sign in with Google to verify your identity."
    }

    useEffect(() => {
        // Listen for messages from popup
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return

            const { type, data, error } = event.data || {}

            if (type === "GOOGLE_AUTH_SUCCESS") {
                setStatus("success")
                setTimeout(() => {
                    onSuccess(data)
                    onClose()
                }, 500)
            } else if (type === "GOOGLE_AUTH_ERROR") {
                setStatus("error")
                const errorMessages = {
                    popup_closed: "Verification cancelled",
                    popup_blocked: "Please allow popups for this site",
                    email_mismatch: "Email does not match. Please use the same email.",
                    user_exists: "An account with this email already exists. Please login instead.",
                    no_account: "No account found with this email",
                    auth_failed: "Verification failed. Please try again.",
                    no_signup_data: "Session expired. Please try again.",
                    google_linked: "This Google account is already linked to another account."
                }
                setErrorMessage(errorMessages[error] || error || "Verification failed")
                onError(error)
            }
        }

        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [onSuccess, onError, onClose])

    useEffect(() => {
        // Poll to check if popup was closed
        if (popup && status === "verifying") {
            const pollTimer = setInterval(() => {
                if (popup.closed) {
                    clearInterval(pollTimer)
                    setStatus("error")
                    setErrorMessage("Verification cancelled")
                    setPopup(null)
                }
            }, 500)
            return () => clearInterval(pollTimer)
        }
    }, [popup, status])

    const handleStartVerification = (state) => {
        const baseUrl = process.env.REACT_APP_BASE_URL
        const authUrl = `${baseUrl}/oauth/google?state=${encodeURIComponent(JSON.stringify(state))}`

        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const newPopup = window.open(
            authUrl,
            "GoogleAuth",
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        )

        if (!newPopup) {
            setStatus("error")
            setErrorMessage("Please allow popups for this site")
            return
        }

        setPopup(newPopup)
        setStatus("verifying")
    }

    const handleRetry = () => {
        setStatus("idle")
        setErrorMessage("")
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-richblack-900 bg-opacity-80">
            <div className="w-11/12 max-w-[400px] rounded-lg border border-richblack-700 bg-richblack-800 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-richblack-5">
                        {titles[mode]}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-richblack-300 hover:text-richblack-5 transition-colors"
                        disabled={status === "verifying"}
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Content based on status */}
                <div className="text-center py-4">
                    {status === "idle" && (
                        <>
                            <FcGoogle size={48} className="mx-auto mb-4" />
                            <p className="text-richblack-200 mb-6">
                                {descriptions[mode]}
                            </p>
                            <button
                                onClick={() => handleStartVerification(
                                    JSON.parse(sessionStorage.getItem("googleAuthState") || "{}")
                                )}
                                className="w-full flex items-center justify-center gap-2 rounded-lg bg-yellow-50 py-3 px-4 font-medium text-richblack-900 hover:bg-yellow-100 transition-all"
                            >
                                <FcGoogle size={20} />
                                <span>Continue with Google</span>
                            </button>
                        </>
                    )}

                    {status === "verifying" && (
                        <>
                            <div className="w-12 h-12 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-richblack-200">
                                Waiting for Google verification...
                            </p>
                            <p className="text-richblack-400 text-sm mt-2">
                                Complete the sign-in in the popup window
                            </p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-12 h-12 rounded-full bg-caribbeangreen-500 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-richblack-5 font-medium">
                                Verification successful!
                            </p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p className="text-pink-200 font-medium mb-2">
                                Verification Failed
                            </p>
                            <p className="text-richblack-300 text-sm mb-4">
                                {errorMessage}
                            </p>
                            <button
                                onClick={handleRetry}
                                className="w-full rounded-lg bg-richblack-700 py-3 px-4 font-medium text-richblack-5 hover:bg-richblack-600 transition-all"
                            >
                                Try Again
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GoogleVerifyModal
