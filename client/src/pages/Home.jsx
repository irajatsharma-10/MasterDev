import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import TextHighlight from '../components/core/HomePage/TextHighlight'
import CTAbutton from '../components/core/HomePage/CTAbutton'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimeLineSection from '../components/core/HomePage/TimeLineSection';
import LearnLanguage from '../components/core/HomePage/LearnLanguage';
import Footer from '../components/common/Footer';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import HomeExplore from '../components/core/HomePage/HomeExplore';
import ReviewSlider from '../components/common/ReviewSlider';



const Home = () => {
    return (
        // HomePage div
        <div className='overflow-x-hidden'>
            {/* Section 1 (Become an Instructor) */}
            <div className='relative mx-auto flex h-full flex-col items-center justify-between text-white px-4 gap-8'>
                {/* Become an instructor button */}
                <Link to={"signUp"}>
                    <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 text-base font-bold text-richblack-200 drop-shadow-[0_1.5px_0px_0px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                        <div className="flex flex-row items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 group-hover:bg-richblack-900">
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>
                {/* Title */}
                <div className='text-4xl font-semibold text-center'>
                    Empower Your Future with <TextHighlight text={"Coding Skills"} />
                </div>
                {/* Subtitle */}
                <div>
                    <p className='text-base text-[#838894] text-center mx-auto w-full max-w-screen-md'>
                        With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                    </p>
                </div>
                {/* Learn More & Book a Demo */}
                <div className='flex flex-wrap gap-4 justify-center'>
                    <CTAbutton linkto={"/login"} active={true}>Learn More</CTAbutton>
                    <CTAbutton linkto={"/signUp"} active={false}>Book a Demo</CTAbutton>
                </div>

                <div className='w-full max-w-screen-lg h-[515px] my-10'>
                    <video className='w-full h-full object-cover shadow-[18px_18px_0px_0px_rgba(245,245,245,1)]' muted autoPlay loop>
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>
                {/* Code Blocks */}
                <div className='relative mx-auto w-full max-w-screen-lg mt-10'>
                    {/* Code Section 1 */}
                    <div className='w-full'>
                        <CodeBlocks
                            position={"lg:flex-row"}
                            heading={
                                <div className="text-3xl font-semibold">
                                    Unlock your
                                    <TextHighlight text={" coding potential"} /> with our online
                                    courses.
                                </div>
                            }
                            subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                            ctabtn1={{ linkto: "/signUp", active: true, text: "Try it Yourself" }}
                            ctabtn2={{ linkto: "/login", active: false, text: "Learn More" }}
                            codeColor={"text-pink-50"}
                            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav>\n <a href="/one">One</a>\n <a href="/two">Two</a>\n <a href="/three">Three</a>\n</nav>\n</body>`}
                            backgroundGradient={<div className="codeblock1 absolute"></div>}
                        />
                    </div>
                    {/* Code Section 2 */}
                    <div className='w-full'>
                        <CodeBlocks
                            position={"lg:flex-row-reverse"}
                            heading={
                                <div className="text-3xl font-semibold">
                                    Start
                                    <TextHighlight text={` coding in seconds`} />
                                </div>
                            }
                            subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                            ctabtn1={{ linkto: "/signUp", active: true, text: "Continue Lesson" }}
                            ctabtn2={{ linkto: "/login", active: false, text: "Learn More" }}
                            codeColor={"text-pink-50"}
                            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav>\n <a href="/one">One</a>\n <a href="/two">Two</a>\n <a href="/three">Three</a>\n</nav>\n</body>`}
                            backgroundGradient={<div className="codeblock2 absolute"></div>}
                        />
                    </div>
                </div>
                <HomeExplore />
            </div>
            {/* Section 2 (white background) */}
            <div className='bg-pure-greys-5 text-richblack-700 '>
                {/* buttons  */}
                <div className='h-60 bg_home flex items-center justify-center'>
                    <div className='w-11/12 max-w-maxContent  flex flex-row gap-3 text-white items-center justify-center'>
                        <CTAbutton linkto={"/login"} active={true}>
                            <div className='flex gap-2 items-center'>
                                Explore Full Catalog
                                <FaArrowRight />
                            </div>
                        </CTAbutton>
                        <CTAbutton linkto={"/signUp"} active={false} children={"Learn More"} />
                    </div>
                </div>
                {/* text  */}
                <div className='w-11/12 max-w-maxContent mx-auto flex flex-col justify-between gap-12 px-30 py-24 bg-[rgba(249, 249, 249, 1)]'>
                    {/* get a job  */}
                    <div className='flex flex-row justify-between'>
                        <div className='font-semibold text-3xl w-[45%]'>
                            Get the skills you need for a
                            <TextHighlight text={` job that is in demand.`} />
                        </div>
                        <div className='flex flex-col items-start gap-10 w-[45%]'>
                            <div className='text-base font-medium text-[rgba(44, 51, 63, 1)]'>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</div>
                            <CTAbutton linkto={'/signUp'} active={true}>Learn More</CTAbutton>
                        </div>
                    </div>
                    {/* leadership  */}
                    <TimeLineSection />
                    {/* Learn language  */}
                    <LearnLanguage />
                </div>
            </div>
            {/* Section 3 (start teaching today)  */}
            <div className='w-11/12 max-w-maxContent px-30 py-24 mx-auto'>
                <InstructorSection />
                {/* <div className='mt-16'>
                    <p className='text-3xl font-semibold text-white text-center'>Reviews from other learners</p>
                </div>
                <ReviewSlider /> */}
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Home