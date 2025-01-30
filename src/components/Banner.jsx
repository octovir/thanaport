import React from 'react';
import About from './About';
import { color, delay, easeInOut, motion } from 'framer-motion'
import { Animator, ScrollContainer, ScrollPage, batch, Fade, FadeIn, FadeOut, Move, MoveIn, MoveOut, Sticky, StickyIn, StickyOut, Zoom, ZoomIn, ZoomOut } from "react-scroll-motion";

//icon
import { IoSchoolSharp } from "react-icons/io5";
import { HiDownload } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { VscLayoutPanelCenter } from 'react-icons/vsc';

//variants
const bannerVariants = {
    hidden: {
        opacity: 0,
        y:100
    },
    show: {
        opacity: 1,
        y:0,
        transition:{
            duration: 0.4,
            ease: "easeInOut" ,
        }
    }
}

const textVariants ={
    hidden: {
        opacity: 0,
        y:100
    },
    show: {
        opacity: 1,
        y:0
    }
}

const buttonVariants ={
    hidden: {
        opacity: 0,
        y:100
    },
    show: {
        opacity: 1,
        y:0,
        transition:{
            duration: 0.4,
            ease: "easeInOut",
            delay: 0.25
        }
    }
}
//main
const Banner= ()=> {
    return (
        <>
        <motion.div

            variants={bannerVariants}
            initial="hidden"
            animate="show"
            className='z-0 w-full px-10 md:px-56 flex justify-items-center flex-col lg:flex-row lg:justify-between md:mt-72 lg:mt-44 md:mb-96 mt-32 text-stone-700'
        >
            
            <div className=' lg:w-[70%] items-center text-center lg:text-left mb-24'>

                <motion.h1 
                    variants={textVariants}
                    initial="hidden"
                    animate="show"
                    transition={
                        {
                            duration:0.4,
                            ease: "easeInOut",
                            delay: 0.05
                        }
                    }
                    className='text-xl lg:text-2xl font-semibold tracking-widest lg:mb-12 mb-14 '
                >
                    T H A N A K R I T <span className='text-red-600'> - </span> R 
                </motion.h1>

                <div>
                    <motion.div 
                        variants={textVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration:0.4,
                                ease: "easeInOut",
                                delay: 0.1
                            }
                        }
                        className='text-4xl md:text-5xl lg:text-6xl font-bold lg:mb-6 mb-2 '
                    >
                        UX/UI DESIGNER
                    </motion.div>

                    <motion.div 
                        variants={textVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration:0.4,
                                ease: "easeInOut",
                                delay: 0.1
                            }
                        } 
                        className='text-3xl md:text-4xl lg:text-6xl font-bold lg:mb-12 mb-16 '
                    >
                        <span className='text-red-600'>&</span> WEB DEVELOPER
                    </motion.div>

                    <motion.h1 
                        variants={textVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration:0.4,
                                ease: "easeInOut",
                                delay: 0.15
                            }
                        }
                        className=' flex justify-center items-center lg:justify-start gap-2 text-xl lg:mb-3 mb-1'
                    >
                        <div>from Mahidol University</div>
                        <IoSchoolSharp />
                    </motion.h1>
                    <motion.h1 
                        variants={textVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration:0.4,
                                ease: "easeInOut",
                                delay: 0.15
                            }
                        } 
                        className='lg:hidden'
                    >
                        Faculty of ICT
                    </motion.h1>

                    <motion.h1 
                        variants={textVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration:0.4,
                                ease: "easeInOut",
                                delay: 0.15
                            }
                        } 
                        className='max-lg:hidden'
                    >
                        Faculty of Information and Communication Technology
                    </motion.h1>
                </div>
                    
            </div>
            <div className=' flex justify-center items-center flex-col lg:w-[30%] mb-64 lg:mb-0'>
                <motion.div
                    variants={textVariants}
                    initial="hidden"
                    animate="show"
                    transition={
                        {
                            duration:0.4,
                            ease: "easeInOut",
                            delay: 0.2
                        }
                    }
                    className='mb-5 animate-bounce text-red-600'
                >
                    <IoMdHeart size={28}  />
                </motion.div>
                <a target='blank' href="/Resume_Thanakrit_Rattanaumnuaysiri.pdf">
                    <motion.button 
                        id='pdf-button'
                        variants={textVariants}
                        initial="hidden"
                        animate="show"
                        whileHover={
                            {   
                                scale: 1.1 ,
                                backgroundColor: '#DC2626' ,
                                color: '#FAFAF9' 
                            }
                        }
                        whileTap={
                            {   
                                scale: 0.9 , 
                                backgroundColor: '#DC2626' , 
                                color: '#FAFAF9'
                            }
                        }
                        transition={
                            {
                                duration: 0.1,
                                ease: "easeInOut"
                            }
                        }
                        className='flex gap-3 items-center bg-stone-200 px-5 py-3 rounded-lg shadow-s '>
                        See Resume
                        <HiDownload/>
                    </motion.button>
                </a>
            </div>
        </motion.div>
        </>
        

    )
}

export default Banner