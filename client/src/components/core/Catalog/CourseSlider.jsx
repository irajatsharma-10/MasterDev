import React from 'react'

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/effect-cards"
import "swiper/css/parallax"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper'

import CatologCourseCard from './CatalogCourseCard'

const CourseSlider = ({ Courses }) => {
    return (
        <>
            {Courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    spaceBetween={25}
                    loop={true}
                    // autoplay={{ delay: 3000 }}  // Correct autoplay prop
                    navigation={true}  // Correct navigation prop
                    pagination={{ clickable: true }}  // Add pagination for dots
                    modules={[FreeMode, Pagination, Autoplay, Navigation]}
                    breakpoints={{
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="max-h-[30rem]"
                >
                    {Courses?.map((course, i) => (
                        <SwiperSlide key={i}>
                            <CatologCourseCard course={course} Height={"h-[250px]"} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p className="text-xl text-richblack-5">No Course Found</p>
            )}
        </>
    )
}

export default CourseSlider;
