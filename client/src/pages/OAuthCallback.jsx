import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setToken } from "../redux/slices/authSlice"
import { setUser } from "../redux/slices/profileSlice"
import toast from "react-hot-toast"

function OAuthCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const token = searchParams.get('token')
        const userParam = searchParams.get('user')
        const error = searchParams.get('error')

        // Check if opened in popup
        const isPopup = window.opener && !window.opener.closed

        if (error) {
            if (isPopup) {
                window.opener.postMessage({
                    type: 'GOOGLE_AUTH_ERROR',
                    error: error
                }, window.location.origin)
                window.close()
            } else {
                toast.error('Authentication failed. Please try again.')
                navigate('/login')
            }
            return
        }

        if (token && userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam))

                if (isPopup) {
                    // Send data to parent window
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_SUCCESS',
                        data: { token, user }
                    }, window.location.origin)
                    window.close()
                } else {
                    // Regular redirect flow
                    localStorage.setItem('token', JSON.stringify(token))
                    localStorage.setItem('user', JSON.stringify(user))
                    dispatch(setToken(token))
                    dispatch(setUser(user))
                    toast.success('Login successful!')
                    navigate('/dashboard/my-profile')
                }
            } catch (err) {
                console.error('OAuth callback error:', err)
                if (isPopup) {
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_ERROR',
                        error: 'parse_error'
                    }, window.location.origin)
                    window.close()
                } else {
                    toast.error('Authentication failed. Please try again.')
                    navigate('/login')
                }
            }
        } else {
            if (isPopup) {
                window.opener.postMessage({
                    type: 'GOOGLE_AUTH_ERROR',
                    error: 'auth_failed'
                }, window.location.origin)
                window.close()
            } else {
                toast.error('Authentication failed. Please try again.')
                navigate('/login')
            }
        }
    }, [searchParams, navigate, dispatch])

    return (
        <div className="min-h-screen flex items-center justify-center bg-richblack-900">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-richblack-5 text-lg">Completing sign in...</p>
            </div>
        </div>
    )
}

export default OAuthCallback
