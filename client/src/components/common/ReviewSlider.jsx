import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const truncateWords = 15

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await apiConnector(
                    "GET",
                    ratingsEndpoints.REVIEWS_DETAILS_API
                )
                if (data?.success) {
                    setReviews(data?.data)
                }
            } catch (error) {
                console.error("Error fetching reviews:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[200px]">
                <div className="w-10 h-10 border-4 border-yellow-50 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[200px] text-richblack-300">
                <p className="text-lg">No reviews yet</p>
                <p className="text-sm mt-2">Be the first to share your learning experience!</p>
            </div>
        )
    }

    return (
        <div className="text-white">
            <div className="my-[50px] h-[220px] max-w-maxContentTab lg:max-w-maxContent">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={20}
                    loop={reviews.length > 4}
                    freeMode={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    modules={[FreeMode, Pagination, Autoplay]}
                    className="w-full"
                >
                    {reviews.map((review, i) => {
                        return (
                            <SwiperSlide key={i}>
                                <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-25 rounded-lg h-[180px]">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                review?.user?.image
                                                    ? review?.user?.image
                                                    : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                                            }
                                            alt={`${review?.user?.firstName}'s profile`}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h3>
                                            <p className="text-[12px] font-medium text-richblack-500 truncate max-w-[150px]">
                                                {review?.course?.courseName}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-richblack-25 flex-grow">
                                        {review?.review?.split(" ").length > truncateWords
                                            ? `${review?.review
                                                .split(" ")
                                                .slice(0, truncateWords)
                                                .join(" ")} ...`
                                            : `${review?.review}`}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-yellow-100">
                                            {review.rating.toFixed(1)}
                                        </span>
                                        <ReactStars
                                            count={5}
                                            value={review.rating}
                                            size={18}
                                            edit={false}
                                            activeColor="#ffd700"
                                            emptyIcon={<FaStar />}
                                            fullIcon={<FaStar />}
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </div>
    )
}

export default ReviewSlider;
