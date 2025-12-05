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
                            Hi 👋🏻 , I’m Gun! <span className="text-red-600">A third-year student</span>who studying at Mahidol University’s Faculty of ICT with experience in both frontend and backend development. I have skills in Typescript, Spring Boot, and Jupyter Notebook. After I take a Data Science course at third-year, I'm very interested in working with data and understanding how it can use to help real business decisions. I have experience using Jupyter Notebook, working with datasets, and applying basic data analysis and machine learning concepts. Now, I am looking for an internship in the Data Science field where I can learn from real projects and improve my technical and analytical skills.
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