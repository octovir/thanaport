import React , {useState , useEffect} from "react";
import Loading from "./Loading";
import {delay, motion} from "framer-motion";

//icon
import { TbStarFilled } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
//motion variants

const cardVariants ={
  hidden: { opacity: 0},
  show: {
    opacity: 1,
    transition: {
      ease: "easeIn",
      staggerChildren: 0.2,
    }
  }
}

const eachCard ={
  hidden: {
    opacity: 0,
    y:50
  },
  show: {
    opacity: 1,
    y:0,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
}

const anyVariants ={
  hidden: {
    opacity: 0,
    y:50
  },
  show: {
    opacity: 1,
    y:0,
    
  }
}

const anyVariants2 ={
  hidden: {
    opacity: 0,
    y:25
  },
  show: {
    opacity: 1,
    y:0,
    
  }
}

const arrowVariants = {
  hidden: {opacity: 0, x: 0},
  show: {opacity: 1, x: -50}
}

const Works = () => {

  const username = 'octovir';

  //github profile data
  const [profile, setProfile] = useState();

  //repo data
  const [repos, setRepos] = useState([]);

  //set loading status
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((res)=> res.json()),
      fetch(`https://api.github.com/users/${username}/repos`).then((res)=> res.json()),
    ])
    .then(([profileData,reposData]) => {
      setProfile(profileData)
      setRepos(reposData);
      setLoading(false);

    })
    .catch((error) => {
      console.error("err fetching data" , error);
      setLoading(false);
    })
  }, [username])

  if(loading) {
    return <Loading />
  }

  console.log(profile)
  console.log(repos);

  return(
    <div className="">
      {/* github profile mobile*/}
      <div className="md:hidden flex flex-col justify-center items-center mt-12">
        {/* head */}
        <div className="w-full flex flex-col text-2xl justify-center items-center gap-4 text-stone-600">
          <motion.div
            variants={anyVariants}
            initial="hidden"
            animate="show"
            transition={
              {
                  duration:0.6,
                  ease: "easeInOut",
                  delay: 0.3,
              }
            }  
          >
            visit my Github
          </motion.div>
          <motion.div
            variants={anyVariants}
            initial="hidden"
            animate="show"
            transition={
              {
                  duration:0.6,
                  ease: "easeInOut",
                  delay: 0.6,
              }
            }
            className="animate-bounce"
          >
            <FaChevronDown color="#dc2626"/>
          </motion.div>
        </div>


        {/* guthub profile */}
        <motion.section 
            variants={anyVariants}
            initial="hidden"
            animate="show"
            transition={
              {
                duration: 0.4,
                ease: "easeIn",
                delay: 0.1
              }
            }
          className="px-10 pt-6 md:px-24"
        >
          <a 
            href={profile.html_url}
            target="_blank"
            rel="noopener"
          >

            <motion.div 
              variants={eachCard}
              initial="hidden"
              animate="show"
              whileTap={
                {
                  scale: 0.95
                }
              } 
              className=" p-5 flex flex-col items-start rounded-2xl drop-shadow-sm shadow-sm bg-stone-300 active:bg-stone-400 active:border-none active:text-stone-50 transition-colors duration-100"
            >
              <div className="flex flex-col gap-2">
                <motion.img 
                variants={anyVariants2}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.6,
                      ease: "easeInOut",
                      delay: 0.3,
                  }
                }  src={profile.avatar_url} alt="GitHub profile picture of Octovir" className="mb-5 rounded-2xl" />
                <motion.div 
                variants={anyVariants2}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.6,
                      ease: "easeInOut",
                      delay: 0.6,
                  }
                } v className="text-2xl">
                  {profile.name}
                </motion.div>
                <motion.div 
                variants={anyVariants2}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.6,
                      ease: "easeInOut",
                      delay: 0.9,
                  }
                }  className="text-lg">
                  {profile.login}
                </motion.div>
                <motion.div 
                variants={anyVariants2}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.6,
                      ease: "easeInOut",
                      delay: 1.2,
                  }
                }  className="flex flex-row gap-1">
                  <IoLocationSharp size={22} color="#dc2626"/> {profile.location}
                </motion.div>
              </div>
              <div>

              </div>
            </motion.div>
          </a>
        </motion.section>
      </div>

      {/* github profile desktop */}

      <div className="max-md:hidden flex justify-between mx-24 mt-14 gap-8">
        <a href={profile.html_url} rel="noopener">
          <div className="">
            <motion.div
              variants={eachCard}
              initial="hidden"
              animate="show"
              whileHover={
                {
                  scale: 1.05
                }
              }
              whileTap={
                {
                  scale: 0.95
                }
              }
              
              className="flex flex-row p-8 gap-5 rounded-2xl shadow-md bg-stone-300 hover:bg-stone-400 hover:text-stone-50 transition-colors duration-400"
            >
              <motion.img 
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.4,
                      ease: "easeInOut",
                  }
                }  
                src={profile.avatar_url} 
                className="w-56 h-56 rounded-2xl"
              ></motion.img>
              <motion.div
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.4,
                      ease: "easeInOut",
                      delay: 0.2,
                  }
                }  
                className="flex flex-col py-4 "
              >
                <motion.div
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.4,
                      ease: "easeInOut",
                      delay: 0.4,
                  }
                }   className="text-2xl font-medium">
                  {profile.name}
                </motion.div>
                <motion.div
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.4,
                      ease: "easeInOut",
                      delay: 0.6,
                  }
                }   className="mb-4">
                  {profile.login}
                </motion.div>
                <motion.div
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.4,
                      ease: "easeInOut",
                      delay: 0.8,
                  }
                }   className="mb-12">
                  {profile.bio}
                </motion.div>
                <motion.div
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.4,
                      ease: "easeInOut",
                      delay: 1,
                  }
                }   className="flex flex-row gap-3">
                  <IoLocationSharp size={22} color="#dc2626"/> {profile.location}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </a>
        <div className=" w-[40%] flex justify-center items-center text-4xl text-stone-700">
          <motion.div
            variants={arrowVariants}
            initial={"hidden"}
            animate={"show"}
            transition={
                {
                    duration: 2,
                    type: "spring",
                    repeat: 5,
                    repeatDelay: 1,
                    ease: "easeInOut"
                }
            }
          >
            <FaChevronLeft color="#dc2626"/>
          </motion.div>
          <motion.div
            variants={anyVariants}
            initial="hidden"
            animate="show"
            transition={
              {
                  duration:0.6,
                  ease: "easeInOut",
                  delay: 0.3,
              }
            }  
          >
            visit my Github
          </motion.div>
        </div>
      </div>


      {/* github repositories */}
      <motion.div 
        variants={anyVariants}
        initial="hidden"
        animate="show"
        transition={
          {
              duration:0.6,
              ease: "easeInOut",
              delay: 0.1
          }
        } 
        className="md:mx-28 md:mt-12 md:text-2xl mx-14 mt-12 text-xl text-center md:text-start"
      >
        repositories
      </motion.div>
      <motion.section 
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-6 px-10 pt-6 pb-10 md:px-24">
        {repos.map((repo) => (
          <a 
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener"
            >
            {/* mobile */}
            <motion.div 
              variants={eachCard}
              whileTap={
                {
                  scale: 0.95
                }
              }
              className="md:hidden flex flex-col gap-3 justify-start items-start w-36 h-36 p-5 rounded-2xl drop-shadow-sm shadow-sm border border-stone-600 active:bg-stone-400 active:border-none active:text-stone-50 transition-colors duration-100 "
            >
              <motion.div 
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.6,
                      ease: "easeInOut",
                      delay: 0.3,
                  }
                }  className="flex flex-row gap-2">
                <TbStarFilled size={23} color="#dc2626"/> <span>{repo.stargazers_count}</span>
              </motion.div>
              <motion.div 
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.6,
                      ease: "easeInOut",
                      delay: 0.6,
                  }
                } className="text-xl w-full">
                {repo.name}
              </motion.div>
            </motion.div>
            
            {/* desktop */}
            <motion.div
              variants={eachCard}
              whileHover={
                {
                  scale: 1.05
                }
              }
              whileTap={
                {
                  scale: 0.95
                }
              }
              className="max-md:hidden flex flex-col gap-3 justify-start items-start w-[100%] h-52 p-8 rounded-2xl drop-shadow-sm shadow-sm border border-stone-600 hover:bg-stone-400 hover:text-stone-50 hover:border-stone-50 transition-colors duration-200"
            >
              <motion.div 
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.6,
                      ease: "easeInOut",
                      delay: 0.3,
                  }
                } 
                className="flex flex-row gap-2"
              >
                <TbStarFilled size={20} color="#dc2626"/> <span>{repo.stargazers_count}</span>
              </motion.div>
              <motion.div 
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.6,
                      ease: "easeInOut",
                      delay: 0.6,
                  }
                }  className="text-xl w-full">
                {repo.full_name}
              </motion.div>
              <motion.div 
                variants={anyVariants}
                initial="hidden"
                animate="show"
                transition={
                  {
                      duration:0.6,
                      ease: "easeInOut",
                      delay: 0.9,
                  }
                }  className="text-base w-full">
                {repo.description ? repo.description : "The project has no description."}
              </motion.div>
            </motion.div>
          </a>
        ))}
      </motion.section>
    </div>
  )
}

export default Works;