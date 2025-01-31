import React from 'react'
import { IoIosMail } from "react-icons/io";
import { TbCloverFilled } from "react-icons/tb";


function Footer() {
    return (
        <footer className='bg-stone-200'>
            <div className='text-md  py-4 flex items-center justify-center'>
                <div className='border flex justify-end items-center gap-2'>Design by Thanakrit <TbCloverFilled/></div>
            </div>
        </footer>
    )
}

export default Footer