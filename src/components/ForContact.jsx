import React from "react";
import {motion} from "framer-motion";

//icon
import { FaMapLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";

function ForContact () {

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        formData.append("access_key", "0e631d90-1efb-42a3-b147-578dd4ab9dea");
    
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
    
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: json
        }).then((res) => res.json());
    
        if (res.success) {
          console.log("Success", res);
        }
    }; 

    //variants
    const componentVariants = {
        hidden: {
            opacity: 0,
            y: 50
        },
        show: {
            opacity: 1,
            y:0,
        }
    }

    return(
        <div className="lg:flex mx-auto lg:justify-between lg:px-10 lg:py-20 xl:p-12 ">
            <div className='lg:w-[35%] lg:mx-auto lg:my-auto md:my-32 my-36'>
                <motion.div 
                    variants={componentVariants}
                    initial="hidden"
                    animate="show"
                    transition={
                        {
                            duration: 0.4,
                            ease: "easeInOut"
                        }
                    }
                    className="text-center text-4xl font-semibold mb-10 lg:mb-16 p-5"
                >
                    <span className="text-red-600">For</span> contact
                </motion.div>
                
                <div className="flex flex-col px-12 lg:px-16 ">

                    <motion.div 
                        variants={componentVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration: 0.4,
                                ease: "easeInOut",
                                delay: 0.1
                            }
                        } 
                    className="flex flex-row justify-center gap-5 mb-4"
                    >
                        <span><FaMapLocationDot size={22} color=""/></span>
                        <div className=''>Faculty of ICT, Mahidol University</div>
                    </motion.div>

                    <motion.div 
                        variants={componentVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration: 0.4,
                                ease: "easeInOut",
                                delay: 0.2
                            }
                        }  className="flex justify-center gap-5 mb-16">
                        <FaPhone size={22} color=""/>
                        <div className=''>065-502-2750</div>
                    </motion.div>

                </div>
            </div>

            <section className='flex flex-col lg:w-[65%] xl:items-center '>
                <form 
                    onSubmit={onSubmit}
                    className=' bg-stone-300 xl:w-[80%] lg:h-[100%] py-16 p-14 xl:p-36 lg:p-24 md:px-52 md:p-32 flex flex-col justify-center gap-5 lg:rounded-xl  '
                >
                    <motion.div 
                        variants={componentVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration: 0.4,
                                ease: "easeInOut",
                            }
                        }  
                        className='text-stone-600 text-3xl md:text-4xl font-semibold mb-2'
                    >
                        Get in touch
                    </motion.div>
                    <motion.div 
                        variants={componentVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration: 0.4,
                                ease: "easeInOut",
                                delay: 0.1
                            }
                        } 
                    >
                        <input name='name' type='text' placeholder='Enter your name' required className='bg-stone-50 p-4 rounded-xl w-full shadow-md'></input>    
                    </motion.div>
                    <motion.div 
                        variants={componentVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration: 0.4,
                                ease: "easeInOut",
                                delay: 0.2
                            }
                        } 
                    >
                        <input name='email' type='email' placeholder='Enter your email' required className='bg-stone-50 p-4 rounded-xl w-full shadow-md'></input>    
                    </motion.div>
                    <motion.div 
                        variants={componentVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration: 0.4,
                                ease: "easeInOut",
                                delay: 0.3
                            }
                        } 
                    >
                        <textarea name='message' placeholder='Enter your message' required className='bg-stone-50 p-4 rounded-xl w-full shadow-md resize-none'></textarea>    
                    </motion.div>
                    <motion.div 
                        variants={componentVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration: 0.4,
                                ease: "easeInOut",
                                delay: 0.4
                            }
                        }  className="flex justify-end">
                        <motion.button 
                            whileHover={
                                {   
                                    scale: 1.1 ,
                                    backgroundColor: '#FAFAF9' ,
                                    color: '#44403C' 
                                }
                            }
                            whileTap={
                                {   
                                    scale: 0.9 , 
                                    backgroundColor: '#FAFAF9' , 
                                    color: '#44403C'
                                }
                            }
                            transition={
                                {
                                    duration: 0.1,
                                    ease: "easeInOut"
                                }
                            } 
                            type='submit' 
                            className='text-stone-50 bg-red-600 py-3 px-5 rounded-xl shadow-md '
                        >
                            Submit
                        </motion.button>
                    </motion.div>
                </form>
            </section>
        </div>        
    )
}

export default ForContact;