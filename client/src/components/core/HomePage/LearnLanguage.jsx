import React from 'react'
import KnowYourProgress from '../../../assets/Images/Know_your_progress.svg'
import PlanYourLessons from '../../../assets/Images/Plan_your_lessons.svg'
import CompareWithOther from '../../../assets/Images/Compare_with_others.svg'
import TextHighlight from '../../core/HomePage/TextHighlight'
import CTAbutton from '../../core/HomePage/CTAbutton'
const LearnLanguage = () => {
    return (
        <div className='bg-[rgba(249, 249, 249, 1)] flex flex-col gap-10 px-30 pt-24'>
            <div className='flex flex-col justify-center items-center gap-3 text-center'>
                <p className='lg:text-4xl font-semibold'>Your swiss knife for <TextHighlight text = {"learning any language"}/></p>
                <p className='lg:text-base text-[rgba(44, 51, 63, 1)] leading-6'>Using spin making learning multiple languages easy. with 20+ languages realistic voice-over,<br /> progress tracking, custom schedule and more.</p>
            </div>
            <div className='lg:max-w-[90%] mx-auto flex lg:flex-row flex-col items-center justify-center transition-all duration-200 ease-linear delay-200 animate-pulse'>
                <img className="object-contain lg:-mr-32 lg:ml-12 lg:mt-12 " src={KnowYourProgress} alt="know your progress" />
                <img className="object-contain lg:-mb-12 lg:mt-0 -mt-12" src={CompareWithOther} alt="Plan your lessons" />
                <img className="object-contain  lg:-ml-40 lg:-mt-5 -mt-12" src={PlanYourLessons} alt="compare with other" />
            </div>
            <div className='w-fit mx-auto mt-12'>
                <CTAbutton linkto = {"/signUp"} active = {true}>Learn More</CTAbutton>
            </div>

        </div>
    )
}

export default LearnLanguage
