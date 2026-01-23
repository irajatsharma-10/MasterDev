import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BsHeart, BsHeartFill } from "react-icons/bs"
import { AiOutlineStar, AiFillStar, AiOutlineShoppingCart } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"

import { apiConnector } from "../../../services/apiconnector"
import { wishlistEndpoints } from "../../../services/apis"
import { addToCart } from "../../../redux/slices/cartSlice"

function Wishlist() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cart } = useSelector((state) => state.cart)
    const [wishlistItems, setWishlistItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchWishlist()
    }, [])

    const fetchWishlist = async () => {
        setLoading(true)
        try {
            const response = await apiConnector("GET", wishlistEndpoints.GET_WISHLIST_API)
            if (response?.data?.success) {
                setWishlistItems(response.data.data || [])
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error)
            toast.error("Failed to load wishlist")
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveFromWishlist = async (courseId) => {
        try {
            const response = await apiConnector("POST", wishlistEndpoints.REMOVE_FROM_WISHLIST_API, { courseId })
            if (response?.data?.success) {
                setWishlistItems(prev => prev.filter(item => item._id !== courseId))
                toast.success("Removed from wishlist")
            }
        } catch (error) {
            console.error("Failed to remove from wishlist:", error)
            toast.error("Failed to remove from wishlist")
        }
    }

    const handleAddToCart = (course) => {
        // Check if already in cart
        const isInCart = cart.some(item => item._id === course._id)
        if (isInCart) {
            toast.error("Course already in cart")
            return
        }
        dispatch(addToCart(course))
        toast.success("Added to cart")
    }

    const renderStars = (rating) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? (
                    <AiFillStar key={i} className="text-yellow-50" />
                ) : (
                    <AiOutlineStar key={i} className="text-yellow-50" />
                )
            )
        }
        return stars
    }

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="text-richblack-5">
            <h1 className="mb-8 text-3xl font-medium">My Wishlist</h1>

            {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <BsHeart className="text-6xl text-richblack-500 mb-4" />
                    <p className="text-xl text-richblack-300 mb-4">Your wishlist is empty</p>
                    <button
                        onClick={() => navigate("/catalog/all")}
                        className="rounded-lg bg-yellow-50 py-3 px-6 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all"
                    >
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {wishlistItems.map((course) => (
                        <div
                            key={course._id}
                            className="flex flex-col rounded-lg border border-richblack-700 bg-richblack-800 overflow-hidden hover:border-richblack-500 transition-all"
                        >
                            {/* Course Thumbnail */}
                            <div className="relative">
                                <img
                                    src={course.thumbnail}
                                    alt={course.courseName}
                                    className="h-40 w-full object-cover"
                                />
                                <button
                                    onClick={() => handleRemoveFromWishlist(course._id)}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-richblack-900/80 hover:bg-richblack-900 transition-all"
                                    title="Remove from wishlist"
                                >
                                    <BsHeartFill className="text-pink-200" />
                                </button>
                            </div>

                            {/* Course Details */}
                            <div className="flex flex-col flex-1 p-4">
                                <h3
                                    className="text-lg font-semibold text-richblack-5 line-clamp-2 cursor-pointer hover:text-yellow-50 transition-colors"
                                    onClick={() => navigate(`/courses/${course._id}`)}
                                >
                                    {course.courseName}
                                </h3>

                                <p className="mt-1 text-sm text-richblack-300">
                                    By {course.instructor?.firstName} {course.instructor?.lastName}
                                </p>

                                {/* Rating */}
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-yellow-50 font-semibold">
                                        {course.averageRating?.toFixed(1) || "N/A"}
                                    </span>
                                    <div className="flex">
                                        {renderStars(Math.round(course.averageRating || 0))}
                                    </div>
                                    <span className="text-richblack-400 text-sm">
                                        ({course.reviewCount || 0} reviews)
                                    </span>
                                </div>

                                {/* Price and Actions */}
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-richblack-700">
                                    <span className="text-xl font-bold text-yellow-50">
                                        Rs. {course.price}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(course)}
                                            className="flex items-center gap-2 rounded-lg bg-yellow-50 py-2 px-4 font-medium text-richblack-900 hover:bg-yellow-100 transition-all"
                                        >
                                            <AiOutlineShoppingCart />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Wishlist
