import React from 'react'
import { FaArrowRight, FaGraduationCap, FaUsers, FaCode, FaAward } from "react-icons/fa";
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

const stats = [
    { icon: FaUsers, value: "10K+", label: "Active Students" },
    { icon: FaCode, value: "500+", label: "Courses" },
    { icon: FaGraduationCap, value: "200+", label: "Expert Instructors" },
    { icon: FaAward, value: "95%", label: "Success Rate" },
];

const Home = () => {
    return (
        <div className='overflow-x-hidden'>
            {/* Hero Section */}
            <div className='relative min-h-[90vh] flex flex-col items-center justify-center bg-hero-gradient'>
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-50/5 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-caribbeangreen-100/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className='relative z-10 mx-auto flex flex-col items-center justify-center text-white px-4 gap-6 pt-20 pb-10'>
                    {/* Become an instructor button */}
                    <Link to={"/signup"} className="animate-fade-in-down">
                        <div className="group mx-auto w-fit rounded-full bg-richblack-800/80 backdrop-blur-sm p-1 text-base font-bold text-richblack-200 border border-richblack-700 transition-all duration-300 hover:scale-105 hover:border-yellow-50/50 hover:shadow-glow-yellow">
                            <div className="flex flex-row items-center gap-2 rounded-full px-6 py-2.5 transition-all duration-300 group-hover:bg-richblack-900">
                                <p>Become an Instructor</p>
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>

                    {/* Title */}
                    <div className='text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl animate-fade-in-up' style={{ animationDelay: '0.2s' }}>
                        Empower Your Future with <TextHighlight text={"Coding Skills"} />
                    </div>

                    {/* Subtitle */}
                    <p className='text-base md:text-lg text-richblack-300 text-center mx-auto w-full max-w-2xl animate-fade-in-up' style={{ animationDelay: '0.4s' }}>
                        With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to hands-on projects, quizzes, and personalized feedback from instructors.
                    </p>

                    {/* CTA Buttons */}
                    <div className='flex flex-wrap gap-4 justify-center mt-4 animate-fade-in-up' style={{ animationDelay: '0.6s' }}>
                        <CTAbutton linkto={"/catalog/web-development"} active={true}>
                            <span className="flex items-center gap-2">
                                Explore Courses <FaArrowRight />
                            </span>
                        </CTAbutton>
                        <CTAbutton linkto={"/signup"} active={false}>Get Started Free</CTAbutton>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 w-full max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center p-4 rounded-xl bg-richblack-800/50 backdrop-blur-sm border border-richblack-700 hover:border-yellow-50/30 transition-all duration-300 hover:scale-105">
                                <stat.icon className="text-yellow-50 text-2xl mb-2" />
                                <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                                <span className="text-sm text-richblack-300">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Video Section */}
                <div className='relative z-10 w-full max-w-5xl px-4 my-10 animate-scale-in' style={{ animationDelay: '1s' }}>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-richblack-700">
                        <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/50 to-transparent pointer-events-none z-10"></div>
                        <video
                            className='w-full aspect-video object-cover'
                            muted
                            autoPlay
                            loop
                            playsInline
                        >
                            <source src={Banner} type="video/mp4" />
                        </video>
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-yellow-50/10 blur-3xl rounded-full -z-10"></div>
                </div>
            </div>

            {/* Code Blocks Section */}
            <div className='bg-richblack-900 py-20'>
                <div className='relative mx-auto w-full max-w-screen-lg px-4'>
                    <div className='w-full mb-16'>
                        <CodeBlocks
                            position={"lg:flex-row"}
                            heading={
                                <div className="text-3xl md:text-4xl font-bold">
                                    Unlock your
                                    <TextHighlight text={" coding potential"} /> with our online courses.
                                </div>
                            }
                            subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                            ctabtn1={{ linkto: "/signup", active: true, text: "Try it Yourself" }}
                            ctabtn2={{ linkto: "/login", active: false, text: "Learn More" }}
                            codeColor={"text-yellow-25"}
                            codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>MasterDev</title>\n</head>\n<body>\n  <h1>Welcome to MasterDev</h1>\n  <nav>\n    <a href="/courses">Courses</a>\n    <a href="/about">About</a>\n  </nav>\n</body>\n</html>`}
                            backgroundGradient={<div className="codeblock1 absolute"></div>}
                        />
                    </div>

                    <div className='w-full'>
                        <CodeBlocks
                            position={"lg:flex-row-reverse"}
                            heading={
                                <div className="text-3xl md:text-4xl font-bold">
                                    Start
                                    <TextHighlight text={` coding in seconds`} />
                                </div>
                            }
                            subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                            ctabtn1={{ linkto: "/signup", active: true, text: "Continue Lesson" }}
                            ctabtn2={{ linkto: "/login", active: false, text: "Learn More" }}
                            codeColor={"text-caribbeangreen-25"}
                            codeblock={`function greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconst user = "Developer";\nconsole.log(greet(user));\n\n// Start your journey\n// with MasterDev today!`}
                            backgroundGradient={<div className="codeblock2 absolute"></div>}
                        />
                    </div>
                </div>

                {/* Explore Courses */}
                <div className="mt-20">
                    <HomeExplore />
                </div>
            </div>

            {/* Section 2 - Skills Section */}
            <div className='bg-pure-greys-5 text-richblack-700'>
                <div className='h-80 bg_home flex items-center justify-center'>
                    <div className='w-11/12 max-w-maxContent flex flex-col md:flex-row gap-4 text-white items-center justify-center'>
                        <CTAbutton linkto={"/catalog/web-development"} active={true}>
                            <div className='flex gap-2 items-center'>
                                Explore Full Catalog
                                <FaArrowRight />
                            </div>
                        </CTAbutton>
                        <CTAbutton linkto={"/signup"} active={false}>
                            Learn More
                        </CTAbutton>
                    </div>
                </div>

                <div className='w-11/12 max-w-maxContent mx-auto flex flex-col justify-between gap-16 px-4 md:px-8 py-20'>
                    <div className='flex flex-col lg:flex-row justify-between gap-8'>
                        <div className='font-bold text-3xl md:text-4xl lg:w-[45%]'>
                            Get the skills you need for a
                            <TextHighlight text={` job that is in demand.`} />
                        </div>
                        <div className='flex flex-col items-start gap-8 lg:w-[45%]'>
                            <p className='text-base md:text-lg text-richblack-600'>
                                The modern tech industry demands more than just technical skills. Build your career with comprehensive courses that prepare you for real-world challenges.
                            </p>
                            <CTAbutton linkto={'/signup'} active={true}>Learn More</CTAbutton>
                        </div>
                    </div>

                    <TimeLineSection />
                    <LearnLanguage />
                </div>
            </div>

            {/* Section 3 - Instructor Section */}
            <div className='bg-richblack-900 py-20'>
                <div className='w-11/12 max-w-maxContent mx-auto px-4'>
                    <InstructorSection />
                </div>
            </div>

            {/* Reviews Section */}
            <div className='bg-richblack-800 py-20'>
                <div className='w-11/12 max-w-maxContent mx-auto px-4'>
                    <h2 className='text-3xl md:text-4xl font-bold text-white text-center mb-4'>
                        What Our Students Say
                    </h2>
                    <p className='text-richblack-300 text-center mb-12 max-w-2xl mx-auto'>
                        Hear from thousands of learners who have transformed their careers with MasterDev
                    </p>
                    <ReviewSlider />
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Home
