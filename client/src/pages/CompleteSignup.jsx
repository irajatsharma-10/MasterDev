import { useState, useEffect, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { BiArrowBack } from "react-icons/bi"
import { setToken } from "../redux/slices/authSlice"
import { setUser } from "../redux/slices/profileSlice"
import { apiConnector } from "../services/apiconnector"
import { oauthEndpoints } from "../services/apis"

function CompleteSignup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const [tokenValid, setTokenValid] = useState(true)

    const token = searchParams.get('token')

    // Check if opened in popup
    const isPopup = window.opener && !window.opener.closed

    const handleCompleteSignup = useCallback(async () => {
        // Get stored signup data
        let signupData

        if (isPopup) {
            // In popup, get data from opener's sessionStorage
            try {
                signupData = JSON.parse(window.opener.sessionStorage.getItem('pendingSignup'))
            } catch {
                signupData = null
            }
        } else {
            signupData = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null')
        }

        if (!signupData) {
            if (isPopup) {
                window.opener.postMessage({
                    type: 'GOOGLE_AUTH_ERROR',
                    error: 'no_signup_data'
                }, window.location.origin)
                window.close()
            } else {
                toast.error('Signup data not found. Please try signing up again.')
                navigate('/signup')
            }
            return
        }

        const toastId = !isPopup ? toast.loading('Creating your account...') : null

        try {
            const response = await apiConnector('POST', oauthEndpoints.COMPLETE_SIGNUP_API, {
                token,
                password: signupData.password,
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                accountType: signupData.accountType
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            if (isPopup) {
                // Clear signup data from opener
                window.opener.sessionStorage.removeItem('pendingSignup')

                // Send success to parent
                window.opener.postMessage({
                    type: 'GOOGLE_AUTH_SUCCESS',
                    data: {
                        token: response.data.token,
                        user: response.data.user
                    }
                }, window.location.origin)
                window.close()
            } else {
                // Clear stored signup data
                sessionStorage.removeItem('pendingSignup')

                // Set auth state
                dispatch(setToken(response.data.token))
                dispatch(setUser(response.data.user))
                localStorage.setItem('token', JSON.stringify(response.data.token))
                localStorage.setItem('user', JSON.stringify(response.data.user))

                toast.success('Account created successfully!')
                navigate('/dashboard/my-profile')
            }
        } catch (error) {
            console.error('Complete signup error:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create account'

            if (isPopup) {
                window.opener.postMessage({
                    type: 'GOOGLE_AUTH_ERROR',
                    error: errorMessage
                }, window.location.origin)
                window.close()
            } else {
                toast.error(errorMessage)
                if (error.response?.status === 401) {
                    sessionStorage.removeItem('pendingSignup')
                    navigate('/signup')
                }
            }
        } finally {
            if (toastId) toast.dismiss(toastId)
        }
    }, [token, isPopup, dispatch, navigate])

    useEffect(() => {
        if (!token) {
            setTokenValid(false)
            if (isPopup) {
                window.opener.postMessage({
                    type: 'GOOGLE_AUTH_ERROR',
                    error: 'invalid_token'
                }, window.location.origin)
                window.close()
            } else {
                toast.error('Invalid verification link. Please try signing up again.')
            }
            return
        }

        handleCompleteSignup()
    }, [token, isPopup, handleCompleteSignup])

    if (!tokenValid && !isPopup) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="max-w-[500px] p-4 lg:p-8 text-center">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                        Invalid Verification Link
                    </h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        The verification link is invalid or has expired. Please try signing up again.
                    </p>
                    <Link
                        to="/signup"
                        className="mt-6 inline-block rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
                    >
                        Back to Sign Up
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="max-w-[500px] p-4 lg:p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                    Creating Your Account
                </h1>
                <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                    Please wait while we set up your account...
                </p>
                {!isPopup && (
                    <div className="mt-6 flex items-center justify-center">
                        <Link to="/signup">
                            <p className="flex items-center gap-x-2 text-richblack-5 hover:text-yellow-50">
                                <BiArrowBack /> Back To Sign Up
                            </p>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CompleteSignup
