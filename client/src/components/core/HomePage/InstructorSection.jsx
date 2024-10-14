import React from 'react'

import Instructor from '../../../assets/Images/Instructor.png'
import TextHighlight from '../HomePage/TextHighlight'
import CTAbutton from '../HomePage/CTAbutton'

import { FaArrowRight } from "react-icons/fa";
const InstructorSection = () => {
    return (
        <div className='flex flex-row justify-center gap-24 items-center '>
            {/* image  */}
            <div className="md:h-[400px] shadow-[-20px_-20px_0px_0px_rgba(255,255,255,1)]">
                <img className="h-full" src={Instructor} alt="Instructor" />
            </div>
            {/* text  */}
            <div className='flex flex-col gap-3 h-fit w-[36%] items-start'>
                <p className='text-4xl text-white'>Become an <br /><TextHighlight text={"instructor"} /></p>
                <p className='text-richblack-300  text-base'>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>
                <div className='flex gap-2 mt-2'>
                    <CTAbutton linkto={"/signUp"} active={true}>Start Teaching Today</CTAbutton>
                    <FaArrowRight />
                </div>
            </div>
        </div>
    )
}

export default InstructorSection