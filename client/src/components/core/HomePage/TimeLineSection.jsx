import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import TimelineImage from '../../../assets/Images/TimelineImage.png'
const TimeLineSection = () => {
    const TimeLine = [
        {
            logo: Logo1,
            heading: "LeaderShip",
            subheading: "Fully committed to success story"
        },
        {
            logo: Logo2,
            heading: "Responsibility",
            subheading: "Students will always be our priority"
        },
        {
            logo: Logo3,
            heading: "Flexibility",
            subheading: "The ability to switch an important skills"
        },
        {
            logo: Logo4,
            heading: "Solve the problem",
            subheading: "Code your way to solution"
        }
    ]
    const imageTag = [
        {
            number: 10,
            title: "years Experience",
        },
        {
            number: 250,
            title: "Types of courses"
        }
    ]
    return (
        <div className='w-full  flex flex-rol items-center justify-between'>
            {/* left section  */}
            <div className='w-[45%] flex flex-col gap-3'>
                {
                    TimeLine.map((item,index)=>(
                        <div className='flex flex-row gap-3 items-center' key = {index}>
                            <div className='w-[52px] h-[52px] rounded-full text-center bg-white flex items-center justify-center relative'>
                                <img src={item.logo} alt="" />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <h1 className='font-semibold text-lg'>{item.heading}</h1>
                                <p className='text-base'>{item.subheading}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            {/* right section  */}
            <div className='shadow-[20px_20px_0px_0px_rgba(255,255,255,1)] relative w-[55%]'>
                <img src={TimelineImage} alt="" />
                <div className='absolute left-[50%] bottom-0 translate-x-[-50%] translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10 '>
                    {
                        imageTag.map((item,i)=>{
                            return (
                                <div className='flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14' key={i}>
                                        <p className="lg:text-3xl text-xl font-bold w-[75px]">{item.number}</p>
                                        <p className="text-caribbeangreen-300 lg:text-base text-sm w-[75px]">{item.title}</p>
                                </div>
                            )
                        })
                    }


                </div>
            </div>
        </div>
    )
}

export default TimeLineSection