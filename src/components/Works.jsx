import React , {useState , useEffect} from "react";
import Loading from "./Loading";
import {delay, motion} from "framer-motion";

//icon
import { TbStarFilled } from "react-icons/tb";

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

const textVariants ={
  hidden: {
    opacity: 0,
    y:50
  },
  show: {
    opacity: 1,
    y:0,
    
  }
}

const Works = () => {

  const username = 'octovir';

  const [repos, setRepos] = useState([]);
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos`)
    .then((response) => response.json())
    .then((data) => {
      setRepos(data);
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

  console.log(repos);

  return(
    <div className="">
      <div className="flex flex-col gap-2 px-10 mt-16 mb-4 md:gap-5 md:px-24 md:mt-20 md:mb-5">
        <motion.p 
          variants={textVariants}
          initial="hidden"
          animate="show"
          transition= {
            {
              duration: 0.4,
              ease: "easeIn",
              delay: 0.1
            }
          }
          className="text-4xl font-semibold"
        ><span className="text-red-600">My</span> projects
        </motion.p>

        <motion.p 
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
          className="text-lg">
            these are my github repositories.
        </motion.p>

      </div>
      <motion.section 
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-6 p-10 md:px-24">
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
              <div className="flex flex-row gap-2">
                <TbStarFilled size={23} color="#dc2626"/> <span>{repo.stargazers_count}</span>
              </div>
              <div className="text-xl w-full">
                {repo.name}
              </div>
              
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
              <div className="flex flex-row gap-2">
                <TbStarFilled size={20} color="#dc2626"/> <span>{repo.stargazers_count}</span>
              </div>
              <div className="text-xl w-full">
                {repo.full_name}
              </div>
              <div className="text-base w-full">
                {repo.description ? repo.description : "The project has no description."}
              </div>
            </motion.div>
          </a>
        ))}
      </motion.section>
    </div>
  )
}

export default Works;