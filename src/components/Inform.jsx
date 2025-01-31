import React from 'react'
import { IoLocationSharp } from "react-icons/io5";
import { IoCall } from "react-icons/io5";

function Inform() {
  return (
    <div className=''>

      <div className="text-center text-4xl font-semibold mt-10 mb-10 p-5">
        For contact
      </div>

      <div className="flex flex-col px-12">
        <div className="flex gap-5 mb-10">
          <IoLocationSharp size={48} />
          <h1 className=''>86/116 Soi Badtansin Salaya, Phutthamonthon District, Nakhon Pathom 73170</h1>
        </div>
            
        <div className="flex gap-5 mb-16">
          <span><IoCall size={20}/></span>
          <h1 className=''>065-502-2750</h1>
        </div>
      </div>

    </div>
  )
}

export default Inform