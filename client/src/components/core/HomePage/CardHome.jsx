import React from 'react'
import { FaUserFriends } from "react-icons/fa";
import { SiProgress } from "react-icons/si";
// current card is indicating the highlighted card
// setCurrentCard is to set which card is to be highlighted SetC
const CardHome = ({data, currentCard, setCurrentCard}) => {
    return (
        <div className={`lg:h-60 lg:w-80 flex flex-col justify-between text-[rgba(66, 72, 84, 1)] rounded-md text-base bg-richblack-800 mx-auto -mb-8 ${currentCard === data?.heading ? "bg-white shadow-[10px_10px_0px_0px_rgba(255,214,10,1)] text-richblack-400": ""}`} onClick={() => setCurrentCard(data?.heading)}>
            <div className='pl-8 pr-12 py-4 flex flex-col gap-3 items-start '>
                <h2 className={`text-xl font-bold capitalize ${currentCard === data?.heading && "text-richblack-800"}`}>{data.heading}</h2>
                <h3 className={`leading-6  ${currentCard === data?.heading && "text-[rgba(88, 93, 105, 1)]"}`}>{data.description}</h3>
            </div>
            <div className={`w-full flex flex-row py-3 px-6 gap-4 border-t-[1px]  border-dashed border-[rgba(66, 72, 84, 1)] items-center  justify-between ${currentCard === data?.heading && "text-blue-300 border-[rgba(66, 72, 84, 1)]"}`}>
                <div className='flex items-center justify-center gap-2'>
                    <FaUserFriends/>
                    <p>{data.level}</p>
                </div>
                <div className={`flex items-center justify-center gap-2 `}>
                    <SiProgress/>
                    <p>{data.lessonNumber} Lessons</p>
                </div>
            </div>
        </div>
    )
}

export default CardHome;