import React, { useState } from 'react';
import { HomePageExplore } from '../../../data/homepage-explore';
import CardHome from '../HomePage/CardHome';
import TextHighlight from '../HomePage/TextHighlight'; // Assuming this component exists

const TabsName = [
    "Free", "New to coding", "Most popular", "Skills paths", "Career paths",
];

const HomeExplore = () => {
    const [currentTab, setCurrentTab] = useState(TabsName[0]);// tab of navbar
    const [courses, setCourses] = useState(HomePageExplore[0]?.courses);// courses card related to that tag
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);// current card is basis on the heading (on which we provide the current selected card)

    const SetMyTabs = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        if (result.length > 0) {
            setCourses(result[0].courses);
            setCurrentCard(result[0].courses[0].heading);
        }
    };

    return (
        <div className='flex flex-col gap-6 items-center justify-center'>
            <div className='text-center '>
                <p className='text-4xl  font-semibold text-white'>
                    Unlock the <TextHighlight text={"power of courses"} />
                </p>
                <p className='text-richblack-200 text-sm mt-2'>Learn to Build Anything You Can Imagine</p>
            </div>
            {/* Switch NavTab */}
            <div className='flex flex-row gap-3 items-center rounded-full bg-richblack-800 px-2 py-1 mb-5  '>
                {TabsName.map((tab, index) => (
                    <div
                        className={`text-sm py-1 px-3 cursor-pointer rounded-full  hover:text-white transition-all duration-200 ${currentTab === tab ? "text-white bg-richblack-900 font-semibold" : "text-richblack-200"}`}
                        key={index}
                        onClick={() => SetMyTabs(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            {/* Cards */}
            <div className='flex flex-row items-center justify-center gap-9'>
                {courses.map((elem,index)=>{
                    return (
                        <CardHome data = {elem} key={index} currentCard = {currentCard} setCurrentCard = {setCurrentCard}/>
                    )
                })}

            </div>
        </div>
    );
};

export default HomeExplore;
