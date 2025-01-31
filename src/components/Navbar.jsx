import React , {useState} from "react";
import { NavLink } from "react-router-dom";
import {easeInOut, motion} from "framer-motion";
import { Link } from "react-router";

//icon
import { BiLogoGmail } from "react-icons/bi";
import { IoMail } from "react-icons/io5";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { BsGithub } from "react-icons/bs";
import { TbMenuDeep } from "react-icons/tb";
import { TbArrowsCross } from "react-icons/tb";

//variants
const navVariants= {
    hidden: {opacity: 0, y:-50},
    show: {
        opacity: 1,
        y:0,
        
    }
}

const navcomVariants= {
    hidden: {opacity: 0, y: -25},
    show: {opacity: 1, y:0}
}

const navphoneVariants= {
    hidden: {opacity: 0, x: -70},
    show: {opacity: 1, x:0}
}

//main
function Navbar(){

        const [isOpen, setIsOpen] = useState(false);

        const toggleMenu = () =>{
            setIsOpen(!isOpen) //set state
        }

    return (
        
        <motion.nav
            variants={navVariants}
            initial="hidden"
            animate="show"
            transition={
                {duration: 0.4,
                ease: "easeIn"}
            }
            className=" z-50 bg-stone-50 na sticky top-0 text-stone-700 bg-opacity-70 backdrop-blur-md lg:p-2 md:p-4 p-4 shadow-sm"
        >
            <div 
                className=" text-lg flex items-center justify-between mx-auto md:px-36 ">

                <div>
                    <Link to="https://github.com/octovir">
                        <motion.button 
                            variants={navcomVariants}
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
                                    ease: "easeInOut",
                                }
                            }
                            
                            className=' lg:flex hidden bg-stone-500 px-3 py-2 rounded-lg hover-bg-big shadow-sm '
                        >
                            <BsGithub color="#FAFAF9" size={24} className='flex items-center hover-text-big hover:transition-duration: 0.25s;' />
                        </motion.button>
                    </Link>
                </div>

                <ul className='lg:flex hidden justify-between gap-4 py-3'>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'font-semibold text-red-600' : undefined)}>
                        <motion.li variants={navcomVariants}
                        initial="hidden"
                        animate="show"
                        transition={
                            {
                                duration: 0.1,
                                ease: "easeInOut",
                            }
                        }
                        className="hover-text-color active:text-red-200 hover-text-big "
                        >
                        Home
                        </motion.li>
                    </NavLink>

                    <NavLink to="/contact" className={({ isActive }) => (isActive ? 'font-semibold text-red-600' : undefined)}>
                        <motion.li
                            variants={navcomVariants}
                            initial="hidden"
                            animate="show"
                            transition={
                                {
                                    duration: 0.1,
                                    ease: "easeInOut",
                                    delay: 0.1
                                }
                            }
                            className="hover-text-color active:text-red-200 hover-text-big "
                        >
                            Contact
                        </motion.li>
                    </NavLink>

                    <NavLink to="/project" className={({ isActive }) => (isActive ? 'font-semibold text-red-600' : undefined)}>
                        <motion.li 
                            variants={navcomVariants}
                            initial="hidden"
                            animate="show"
                            transition={
                                {
                                    duration: 0.1,
                                    ease: "easeInOut",
                                    delay: 0.2
                                }
                            }
                            className="hover-text-color active:text-red-200 hover-text-big "
                        >
                            Project
                        </motion.li>
                    </NavLink>
                </ul>

            </div>

            {/* mobile nav */}
            <div>
                <div className="flex justify-between items-center lg:hidden">
                    <a href="https://github.com/octovir">
                        <button className="lg:hidden">
                            <BsGithub size={36}/>
                        </button>
                    </a>
                    {isOpen ? <TbMenuDeep onClick={toggleMenu} size={36} className="text-red-600"/> : <TbMenuDeep onClick={toggleMenu} size={36}/> }
                </div>
                
                {isOpen ? (
                    <motion.nav
                    >
                        <motion.ul 
                            initial={
                                {
                                    opacity:0,
                                    x:100
                                }
                            }
                            animate={
                                {
                                    opacity:1,
                                    x:0
                                }
                            }
                            transition={
                                {
                                    duration: 0.2,
                                    ease:"easeOut",
                                    delay: 0.2
                                }
                            }
                            className='flex lg:hidden flex-col gap-6 py-3 items-end text-2xl'
                        >
                            <NavLink to="/" className={({ isActive }) => (isActive ? 'font-semibold text-red-600' : undefined)}>
                                <motion.li 
                                    variants={navphoneVariants}
                                    initial="hidden"
                                    animate="show"
                                    transition={
                                        {
                                            duration: 0.3,
                                            ease: "easeInOut",
                                            delay: 0.05
                                        }
                                    }
                                    className="hover-text-color active:text-red-200 hover-text-big "
                                >
                                    Home
                                </motion.li>
                            </NavLink>

                            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'font-semibold text-red-600' : undefined)}>
                                <motion.li 
                                    variants={navphoneVariants}
                                    initial="hidden"
                                    animate="show"
                                    transition={
                                        {
                                            duration: 0.3,
                                            ease: "easeInOut",
                                            delay: 0.08
                                        }
                                    }
                                    className="hover-text-color active:text-red-200 hover-text-big "
                                >
                                    Contact
                                </motion.li>
                            </NavLink>
                            <NavLink to="/project" className={({ isActive }) => (isActive ? 'font-semibold text-red-600' : undefined)}>
                                <motion.li 
                                    variants={navphoneVariants}
                                    initial="hidden"
                                    animate="show"
                                    transition={
                                        {
                                            duration: 0.3,
                                            ease: "easeInOut",
                                            delay: 0.11
                                        }
                                    }
                                    className="hover-text-color active:text-red-200 hover-text-big "
                                >
                                    Project
                                </motion.li>
                            </NavLink>
                        </motion.ul>
                    </motion.nav>
                ) :null}
            </div>
            
        </motion.nav>
    )
    
}

export default Navbar