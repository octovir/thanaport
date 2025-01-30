import React from 'react'
import { IoIosMail } from "react-icons/io";


function Footer() {
    return (
        <footer className='bg-stone-200'>
            <div className='text-lg py-4 flex items-center justify-center'>
                <div className='border flex justify-end items-center gap-2'>thanakrit.rat@student.mahidol.ac.th<IoIosMail size={24}/></div>
            </div>
        </footer>
    )
}

export default Footer