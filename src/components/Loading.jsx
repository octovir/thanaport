import React from 'react'
import { motion } from 'framer-motion'

function Loading() {

    const dotVariants1 = {
        hidden: {opacity: 0, x: 75},
        show: {opacity: 1, x: 0},
    }

    const dotVariants2 = {
        hidden: {opacity: 0, x: -75},
        show: {opacity: 1, x: 0}
    }

    const dotVariants3 = {
        hidden: {opacity: 0, y:75},
        show: {opacity: 1, y:0}
    }

  return (
    <div className='grid justify-center gap-5 py-80 '>
        <motion.div
            variants={dotVariants1}
            initial={"hidden"}
            animate={"show"}
            transition={
                {
                    duration: 0.7,
                    type: "spring",
                    repeat: Infinity,
                    repeatDelay: 1.4,
                    ease: "easeInOut"
                }
            }
            className='w-5 h-5 bg-stone-600 rounded-full'
        >
            
        </motion.div>

        <motion.div
            variants={dotVariants2}
            initial={"hidden"}
            animate={"show"} 
            transition={
                {
                    duration: 0.7,
                    delay: 0.7,
                    type: "spring",
                    repeat: Infinity,
                    repeatDelay: 1.4,
                    ease: "easeInOut"
                }
            }
            className='w-5 h-5 bg-red-500 rounded-full'
        >
             
        </motion.div>

         <motion.div
            variants={dotVariants3}
            initial={"hidden"}
            animate={"show"} 
            transition={
                {
                    duration: 0.7,
                    delay: 1.4,
                    type: "spring",
                    repeat: Infinity,
                    repeatDelay: 1.4,
                    ease: "easeInOut"
                }
            }
            className='w-5 h-5 bg-stone-600 rounded-full'
        >
            
        </motion.div>
    </div>
  )
}

export default Loading