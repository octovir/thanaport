import React, { useEffect, useRef } from "react";
import {motion, useScroll,useAnimation, useInView} from 'framer-motion';

//icon
import { IoMdContact } from "react-icons/io";

function About() {
    const {scrollYProgress: completionProgress} =useScroll()

    const checkRef = useRef(null)
    const isInView = useInView(checkRef, {once: true})

    const mainControls = useAnimation()
    useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
        }
    }, [isInView])

    return(
        <>
        <motion.div
            className="z-0 text-center mx-auto flex flex-col py-36 bg-stone-300  shadow-md "
        >
            <div ref={checkRef} className="">
                <motion.div 
                    animate={mainControls}
                    className=" text-stone-600 text-5xl font-semibold mb-8 md:mb-12 flex justify-center gap-5"
                    initial="hidden"
                    variants={
                        {
                            hidden: {opacity: 0, Y: 75},
                            visible: {opacity: 1, Y: 0}
                        }
                    }
                    transition={{delay: 0.05}}
                >
                    About me
                </motion.div>
                <motion.div 
                    className="flex justify-center bg-stone drop-shadow-lg"
                >
                    {/* massage */}
                    <motion.div 
                        animate={mainControls}
                        initial="hidden"
                        variants={
                            {
                                hidden: {opacity: 0, Y: 75},
                                visible: {opacity: 1, Y: 0}
                            }
                        }
                        transition={{delay: 0.1}}
                        className="flex flex-col bg-stone-50 w-[80%] md:w-[70%] lg:w-[55%] p-8 md:p-12 rounded-3xl "
                    >
                        <motion.div 
                            animate={mainControls}
                            initial="hidden"
                            variants={
                                {
                                    hidden: {opacity: 0, Y: 75},
                                    visible: {opacity: 1, Y: 0}
                                }
                            }
                            transition={{delay: 0.15}}
                            className=" mb-6 text-left"
                        >
                            <IoMdContact className="md:text-6xl text-5xl"/>
                        </motion.div>
                        <motion.div 
                            animate={mainControls}
                            initial="hidden"
                            variants={
                                {
                                    hidden: {opacity: 0, Y: 75},
                                    visible: {opacity: 1, Y: 0}
                                }
                            }
                            transition={{delay: 0.2}}
                            className="flex flex-col text-left md:text-xl "
                        >
                            <div>
                            Hi 👋🏻 , I’m Thanakrit! <span className="text-red-600">A third-year student</span> at Mahidol University with a background in Full-stack development and Data Science. My goal is become a Business Analyst who can connect IT and business. I am interested in understanding business workflows and using tools like Excel and Power BI to identify problems and suggest improvements. With my technical background, I can turn business requirements into clear tasks for the dev team. I am looking for a BA internship to practice being the connector between business goals and technical execution.
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>

                {/* social */}
                <div className=" mt-10 flex justify-center items-center">
                        <div className="flex flex-row gap-3">
                            <div className=" bg-white p-4 rounded-full shadow-md w-5 h-5">
                            </div>
                            <div className=" bg-stone-50 p-4 rounded-full shadow-md w-5 h-5">
                            </div>
                            <div className=" bg-stone-50 p-4 rounded-full shadow-md w-5 h-5">
                            </div>
                        </div>
                    </div>
            </div>
        </motion.div>
        </>

    )
}

export default About;