import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';
import CTAbutton from './CTAbutton';

const CodeBlocks = ({ position, heading, subheading, ctabtn1, ctabtn2, codeColor, codeblock,backgroundGradient}) => {
    // backgroundGradient is actually a div
    return (
        <div className = {`flex ${position} mb-10  justify-between `}>
            {/*  textCodeBlock  */}
            <div className='w-[40%] flex flex-col gap-8'>
                <h1 className='text-3xl font-semibold'>
                    {heading}
                </h1>
                <h2 className='text-base text-[#838894]'>
                    {subheading}
                </h2>
                <div className='flex flex-row gap-3 mt-3'> 
                    <CTAbutton linkto = {ctabtn1.link} active = {ctabtn1.active} >
                        <div className='flex gap-2 items-center'>
                            {ctabtn1.text}
                            <FaArrowRight/>
                        </div>
                    </CTAbutton>
                    <CTAbutton linkto={ctabtn2.link} active = {ctabtn2.active} >
                        {ctabtn2.text}
                    </CTAbutton>
                </div>
            </div>
            {/* html block  */}
            <div className="h-fit relative flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 w-[50%]  lg:w-[470px] border-box">
                {backgroundGradient}
                <div className='flex select-none flex-col w-[10%] text-richblack-400 text-center font-bold font-inter'>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                    <p>12</p>
                    <p>13</p>
                </div>
                
                <div className={`w-[90%] flex flex-col gap-2 font-mono pr-1 font-semibold ${codeColor} `}>
                    <TypeAnimation sequence={[codeblock,3000,""]} repeat={Infinity} cursor ={true} style ={{whiteSpace: "pre-line", display:"block"}}  omitDeletionAnimation={true} />
                </div>
            </div>

        </div>
    )
}

export default CodeBlocks
